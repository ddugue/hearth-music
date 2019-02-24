#!/usr/bin/env python

import logging
import argparse
import subprocess
import os

from pydbus import SessionBus, SystemBus

class Player:
    "DBUS controlled media player interface"
    PLAYING = "Playing"
    PAUSED = "Paused"
    STOPPED = "Stopped"

    def __init__(self, name="org.mpris.MediaPlayer2.vlc"):
        self._raw_bus = SessionBus()
        self._bus = self._raw_bus.get(name, '/org/mpris/MediaPlayer2')

    @property
    def bus(self):
        return self._bus

    @property
    def tracks(self):
        """ Tracks in current playlist """
        return self.bus.GetTracksMetadata(self.bus.Tracks)

    @property
    def current(self):
        """ Return current playing track """
        return self.bus.Metadata

    @property
    def status(self):
        """ Return the playback status (Playing, Paused, Stopped)"""
        return self.bus.PlaybackStatus

    def help(self):
        """ Return different option for Media Player 2 interface """
        help(self.bus)

    def playpause(self):
        """ Toggle play / pause """
        self.bus.PlayPause()

    def pause(self):
        """ Pause current playing """
        self.bus.Pause()

    def play(self, song=None):
        """ Resume playing or add a song """
        if song:
            self.clear()
            self.queue(song)
        self.bus.Play()

    def next(self):
        """ Skip to next song in playlist """
        self.bus.Next()

    def previous(self):
        """ Go to previous song in playlist """
        self.bus.Previous()

    def restart(self):
        """ Restart current song """
        current = self.current
        if current:
            self.bus.SetPosition(self.current.get('mpris:trackid'), 0)

    def remove(self, trackid):
        """ Remove track id from playlist """
        self.bus.RemoveTrack(trackid)

    def clear(self):
        """ Clear current playlist """
        for track in self.tracks:
            self.remove(track.get('mpris:trackid'))

    def queue(self, uri):
        """Add url or file to end of playlist"""
        if uri.startswith('http'):
            url = uri
        else:
            url = "file:///%s" % os.path.abspath(uri)

        obj = "/org/mpris/MediaPlayer2/TrackList/NoTrack"
        is_not_playing = self.status != self.PLAYING
        tracks = self.tracks
        if tracks:
            obj = tracks[-1].get("mpris:trackid")
        if is_not_playing and self.current:
            obj = self.current.get('mpris:trackid')
        self._bus.AddTrack(url, obj, is_not_playing)

    def print_tracks(self):
        """Print current playlist information"""
        i = 1
        current = self.current
        for track in self.tracks:
            _id = track.get('mpris:trackid')
            if current.get('mpris:trackid') == _id:
                cmd = """%i - \033[1m%s (%s) [[%s]]\033[0m"""
            else:
                cmd = """%i - %s (%s) [[%s]]"""
            print(cmd % (
                i,
                track.get('xesam:title'),
                track.get('xesam:artist')[0],
                track.get('mpris:trackid'),
            ))

            i += 1


def main():
    "Main execution"
    METHODS = [
        'play', 'playpause', 'pause',
        'help', 'next', 'previous',
        'list', 'queue', 'restart',
        'clear'
    ]
    parser = argparse.ArgumentParser(description='Control VLC instance through DBUS')
    parser.add_argument('command', help='Command to send through DBUS', choices=METHODS)
    parser.add_argument('--debug', help='Log and debug', action='store_true')
    parser.add_argument('param', nargs='?', default=None)
    args = parser.parse_args()

    if args.debug:
        logging.basicConfig(level=logging.DEBUG)
    else:
        logging.basicConfig(level=logging.INFO)

    player = Player()
    try:
        if args.command == 'help': player.help()
        elif args.command == 'playpause': player.playpause()
        elif args.command == 'pause': player.pause()
        elif args.command == 'next': player.next()
        elif args.command == 'previous': player.previous()
        elif args.command == 'list': player.print_tracks()
        elif args.command == 'restart': player.restart()
        elif args.command == 'clear': player.clear()
        elif args.command == 'queue':
            assert args.param
            player.queue(args.param)
        elif args.command == 'play': player.play(args.param)

    except Exception as e:
        logging.error("(%s): %s", e.__class__.__name__, e)
        exit(1)

if __name__ == "__main__":
    main()
