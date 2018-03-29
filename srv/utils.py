# from pydub import AudioSegment
import os

def convert_to_mp3(dirpath, filename, delete=False):
    # if not track_info: return None
    if filename.endswith('.mp3'): return filename
    if filename.endswith('.m4a'):
        nfilepath = filename.replace('.m4a', '.mp3')
        m4a = AudioSegment.from_file(os.path.join(dirpath, filename), 'm4a')
        m4a.export(os.path.join(dirpath, nfilepath), format="mp3", bitrate="320k")
        return nfilepath
    return filename
