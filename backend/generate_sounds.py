import wave
import struct
import math
import os

def generate_tone(filename, frequencies, duration, wave_type='sine'):
    sample_rate = 44100
    num_samples = int(sample_rate * duration)
    
    with wave.open(filename, 'w') as wav_file:
        wav_file.setnchannels(1)
        wav_file.setsampwidth(2)
        wav_file.setframerate(sample_rate)
        
        for i in range(num_samples):
            t = float(i) / sample_rate
            # Play sequence of frequencies if it's a list (split duration)
            if isinstance(frequencies, list):
                idx = int((t / duration) * len(frequencies))
                freq = frequencies[idx]
            else:
                freq = frequencies
                
            if wave_type == 'sine':
                value = math.sin(2.0 * math.pi * freq * t)
            elif wave_type == 'sawtooth':
                value = 2.0 * (t * freq - math.floor(t * freq + 0.5))
            else:
                value = 0
                
            # Envelope to avoid clicking
            envelope = 1.0
            if i < 1000:
                envelope = i / 1000.0
            elif i > num_samples - 1000:
                envelope = (num_samples - i) / 1000.0
                
            value = value * envelope * 16000 # amplitude
            data = struct.pack('<h', int(value))
            wav_file.writeframesraw(data)

# Ensure public dir exists
public_dir = r"C:\Users\Lenovo\OneDrive\Desktop\duo lingo assignment\frontend\public"

generate_tone(os.path.join(public_dir, 'correct.wav'), [880, 1100], 0.3, 'sine')
generate_tone(os.path.join(public_dir, 'incorrect.wav'), 150, 0.4, 'sawtooth')
generate_tone(os.path.join(public_dir, 'finish.wav'), [523.25, 659.25, 783.99, 1046.50], 0.8, 'sine')

print("Sounds generated!")
