
import mutagen
import os

def extract(l):
    """ Extract the first element of a list, raise an error if more than 1 elem """
    if l is None: return None
    if len(l) > 1:
        raise ValueError('More than 1 Value')
    try:
        return l[0]
    except IndexError:
        return None

def get_tag(tags, name):
    return list(tags.get(name, []))


def sanitize_genres(genres):
    l = list()
    for genre in genres:
        for g in genre.split(','):
            l.append(g.strip())
    return l

def sanitize_year(year):
    if year is None: return year
    if isinstance(year, mutagen.id3.ID3TimeStamp):
        return year.year
    if len(year) == 4: return int(year)
    return None

def sanitize_track(track):
    if track is None: return track
    if isinstance(track, tuple):
        return track[0]
    if '/' in track:
        return int(track.split('/')[0])
    return int(track)

def sanitize_disk(disk):
    if disk is None: return disk
    if isinstance(disk, tuple):
        return disk[0]
    if '/' in disk:
        return int(disk.split('/')[0])
    return int(disk)

def get_track_info_mp4(filepath, tags, stream, cover=None):
    """ Parses track information from mp4 file """
    discogs = extract(tags.get('----:com.apple.iTunes:DISCOGS_RELEASE_ID'))
    if not cover:
        coverinfo = extract(tags.get('covr'))
        if coverinfo:
            if coverinfo.imageformat == mutagen.mp4.AtomDataType.JPEG:
                cover = os.path.dirname(filepath) + '/cover.jpg'
            elif coverinfo.imageformat == mutagen.mp4.AtomDataType.PNG:
                cover = os.path.dirname(filepath) + '/cover.png'
            if cover:
                f = open(cover, 'wb+')
                f.write(bytes(coverinfo))
                f.close()

    return {
        "title": extract(tags.get('\xa9nam')),
        "track": sanitize_track(extract(tags.get('trkn'))),
        "artists": tags.get('\xa9ART'),
        "albumartist": extract(tags.get('aART')) or extract(tags.get('\xa9ART')),
        "album": extract(tags.get('\xa9alb')),
        "discogs_id": bytes(discogs).decode('utf-8') if discogs else None,
        "musicbrainz_id": "",
        "disk": sanitize_disk(extract(tags.get('disk'))),
        "year": sanitize_year(extract(tags.get('\xa9day'))),
        "genres": sanitize_genres(tags.get('\xa9gen')),
        "length": stream.length,
        "bitrate": stream.bitrate,
        "size": os.path.getsize(filepath),
        "cover": cover,
        "filepath": filepath,
    }

def get_track_info_mp3(filepath, tags, stream, cover):
    """ Parses track information from mp3 file """
    tag = lambda t: get_tag(tags, t)
    discogs = extract(list(filter(lambda x: x.desc == 'DISCOGS_RELEASE_ID', tags.getall('TXXX'))))
    musicbrainz = extract(list(filter(lambda x: x.desc == 'MusicBrainz Album Id', tags.getall('TXXX'))))
    if musicbrainz: musicbrainz = extract(musicbrainz.text)
    if not cover:
        coverinfo = tags.get('APIC:')
        if coverinfo:
            if coverinfo.mime == 'image/jpeg':
                cover = os.path.dirname(filepath) + '/cover.jpg'
            else:
                raise ValueError('Not supporting %s' % coverinfo.mime)
            if cover:
                f = open(cover, 'wb+')
                f.write(coverinfo.data)
                f.close()

    track = sanitize_track(extract(tag('TRCK')))

    date = tag('TDRC') or tag('TDAT') or tag('TYER')
    return {
        "title": extract(tag('TIT2')),
        "track": track,
        "artists": tag('TPE1'),
        "albumartist": extract(tag('TPE2')) or extract(tags.get('TPE1')),
        "album": extract(tag('TALB')),
        "discogs_id": bytes(discogs).decode('utf-8') if discogs else None,
        "musicbrainz_id": musicbrainz,
        "disk": sanitize_disk(extract(tag('TPOS'))),
        "year": sanitize_year(extract(date)),
        "genres": sanitize_genres(tag('TCON')),
        "length": stream.length,
        "bitrate": stream.bitrate,
        "size": os.path.getsize(filepath),
        "cover": cover,
        "filepath": filepath,
    }

COVERS = {}
def find_cover(folder):
    """ Find the cover file base on a folder """
    if COVERS.get(folder) is None:
        for prefix in ['cover', 'Cover', 'Folder', 'folder']:
            for suffix in ['.png', '.jpg', '.jpeg']:
                f = os.path.join(folder, prefix + suffix)
                if os.path.isfile(f):
                    COVERS[folder] = f
                    return f
    return COVERS.get(folder)

def get_track_info(dirpath, f):
    """ Parses track information from mutagen """
    filepath = os.path.join(dirpath, f)
    track = mutagen.File(filepath)
    if not track:
        if filepath.endswith('.mp3') or filepath.endswith('.m4a'):
            raise ValueError('Skipped an mp3 or an m4a')
        return None

    cover = find_cover(dirpath)
    if isinstance(track.tags, mutagen.id3.ID3):
        return get_track_info_mp3(filepath, track.tags, track.info, cover)
    if isinstance(track.tags, mutagen.mp4.MP4Tags):
        return get_track_info_mp4(filepath, track.tags, track.info, cover)
    raise ValueError("No parser for file format")
