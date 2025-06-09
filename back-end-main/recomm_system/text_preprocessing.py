import os
import re
import pandas as pd
import numpy as np
import string
from nltk.corpus import stopwords
from Sastrawi.Stemmer.StemmerFactory import StemmerFactory
from sklearn.utils import resample
import requests

def preprocess_text(text):
    if pd.isna(text) or not isinstance(text, str) or text.strip() == "":
        return ""

    text_clean = cleaningText(text)
    text_casefolded = casefoldingText(text_clean)
    text_stemmed = stemmingText(text_casefolded)
    text_slang_fixed = fix_slangwords(text_stemmed)
    text_tokenized = tokenizingText(text_slang_fixed)
    text_filtered = filteringText(text_tokenized)
    text_final = toSentence(text_filtered)

    return text_final

#####################################################################################
def cleaningText(text):
    text = re.sub(r'@[A-Za-z0-9]+', '', text) # menghapus mention
    text = re.sub(r'#[A-Za-z0-9]+', '', text) # menghapus hashtag
    text = re.sub(r'RT[\s]', '', text) # menghapus RT
    text = re.sub(r"http\S+", '', text) # menghapus link
    text = re.sub(r'[0-9]+', '', text) # menghapus angka
    text = re.sub(r'[^\w\s]', '', text) # menghapus karakter selain huruf dan angka
 
    text = text.replace('\n', ' ') # mengganti baris baru dengan spasi
    text = text.translate(str.maketrans('', '', string.punctuation)) # menghapus semua tanda baca
    text = text.strip(' ') # menghapus karakter spasi dari kiri dan kanan teks

    # remove emojis
    emoji_pattern = re.compile(
        "["                               
        u"\U0001F600-\U0001F64F"
        u"\U0001F300-\U0001F5FF"
        u"\U0001F680-\U0001F6FF"
        u"\U0001F1E0-\U0001F1FF"
        u"\U00002700-\U000027BF"
        u"\U000024C2-\U0001F251"
        "]+", flags=re.UNICODE)
    
    text = emoji_pattern.sub(r'', text)
    
    return text
 
def casefoldingText(text): # Mengubah semua karakter dalam teks menjadi huruf kecil
    text = text.lower()
    return text
 
# def tokenizingText(text): # Memecah atau membagi string, teks menjadi daftar token
#     text = word_tokenize(text)
#     return text
 
def tokenizingText(text):
    if pd.isna(text):
        return []
    return text.split()

def filteringText(text): # Menghapus stopwords dalam teks
    listStopwords = set(stopwords.words('indonesian'))
    listStopwords1 = set(stopwords.words('english'))
    listStopwords.update(listStopwords)
    # listStopwords.update(listStopwords1)
    listStopwords.update(['iya','yaa','nya','na','sih','ku',"di","ya","loh","kah","woi","woii","woy", "nih", "trus", "tuh",\
                          "yah", "ajah", "lagi", "lah", "aj", "aja", "jg", "juga", "jga", "jugaa", "yng", 'apa', "cuman", "deh",\
                            "min", "gak", "cuma",\
                            "si", "an", "dikit", "langsung"])
    filtered = []
    for txt in text:
        if txt not in listStopwords:
            filtered.append(txt)
    text = filtered
    return text
 
factory = StemmerFactory()
stemmer = factory.create_stemmer()

def stemmingText(text):
    words = text.split()
    stemmed_words = [stemmer.stem(word) for word in words]
    stemmed_text = ' '.join(stemmed_words)
    return stemmed_text
 
def toSentence(list_words): # Mengubah daftar kata menjadi kalimat
    sentence = ' '.join(word for word in list_words)
    return sentence

# Download slang dictionary from a public dataset (if available)
url = "https://raw.githubusercontent.com/louisowen6/NLP_bahasa_resources/refs/heads/master/combined_slang_words.txt"
slang_dict = requests.get(url).json()

slang_dict['aku'] = 'saya'
slang_dict['ak'] = 'saya'
slang_dict['gua'] = 'saya'
slang_dict['gw'] = 'saya'

slang_dict['jlk'] = 'jelek'
slang_dict['jlek'] = 'jelek'
slang_dict['burik'] = 'jelek'
slang_dict['buriq'] = 'jelek'
slang_dict['ampas'] = 'jelek'
slang_dict['amps'] = 'jelek'
slang_dict['buruk'] = 'jelek'
slang_dict['kentang'] = 'jelek'
slang_dict['bobrok'] = 'jelek'

slang_dict['bgs'] = 'bagus'
slang_dict['wokeh'] = 'bagus'
slang_dict['bgus'] = 'bagus'
slang_dict['baguss'] = 'bagus'

slang_dict['trnyata'] = 'ternyata'

slang_dict['amann'] = 'aman'

slang_dict['syukaa'] = 'suka'

slang_dict['bgt'] = 'banget'
slang_dict['bgtt'] = 'banget'

slang_dict['kren'] = 'keren'

slang_dict['udh'] = 'udah'

slang_dict['kasi'] = 'kasih'
slang_dict['ksi'] = 'kasih'
slang_dict['ksih'] = 'kasih'

slang_dict['gk'] = 'gak'
slang_dict['ga'] = 'gak'
slang_dict['gaa'] = 'gak'
slang_dict['kagak'] = 'gak'
slang_dict['kgk'] = 'gak'
slang_dict['g'] = 'gak'
slang_dict['engga'] = 'gak'
slang_dict['tdk'] = 'gak'
slang_dict['nggk'] = 'gak'
slang_dict['no'] = 'gak'

slang_dict['jls'] = 'jelas'
slang_dict['jlas'] = 'jelas'
slang_dict['danta'] = 'jelas'

slang_dict['mntp'] = 'mantap'
slang_dict['mantul'] = 'mantap'
slang_dict['mntap'] = 'mantap'

slang_dict['lg'] = 'lagi'
slang_dict['lgi'] = 'lagi'

slang_dict['uk'] = 'ukuran'

slang_dict['ksel'] = 'kesal'
slang_dict['kesel'] = 'kesal'
slang_dict['sebel'] = 'kesal'
slang_dict['sebal'] = 'kesal'

slang_dict['bacod'] = 'bacot'
slang_dict['bct'] = 'bacot'
slang_dict['bcd'] = 'bacot'

slang_dict['goblog'] = 'goblok'
slang_dict['gblg'] = 'goblok'
slang_dict['gblk'] = 'goblok'
slang_dict['bego'] = 'goblok'
slang_dict['bgo'] = 'goblok'
slang_dict['tolol'] = 'goblok'
slang_dict['tlol'] = 'goblok'
slang_dict['idiot'] = 'goblok'

slang_dict['trun'] = 'turun'

slang_dict['brg'] = 'barang'
slang_dict['brang'] = 'barang'
slang_dict['barng'] = 'barang'

slang_dict['cm'] = 'cuma'
slang_dict['cma'] = 'cuma'
slang_dict['cman'] = 'cuma'
slang_dict['cmn'] = 'cuma'

slang_dict['yt'] = 'youtube'

slang_dict['wrnaa'] = 'warna'

slang_dict['ajg'] = 'anjing'
slang_dict['anj'] = 'anjing'
slang_dict['anjg'] = 'anjing'
slang_dict['anjir'] = 'anjing'
slang_dict['anjr'] = 'anjing'

slang_dict['leg'] = 'lambat'
slang_dict['ngeleg'] = 'lambat'
slang_dict['lemod'] = 'lambat'
slang_dict['lemot'] = 'lambat'

slang_dict['happy'] = 'senang'

slang_dict['satset'] = 'cepat'
slang_dict['cpt'] = 'cepat'

slang_dict['pass'] = 'pas'

slang_dict['sbg'] = 'sebagai'

slang_dict['wr'] = 'win rate'
slang_dict['winrate'] = 'win rate'
slang_dict['ws'] = 'win streak'
slang_dict['winstreak'] = 'win streak'

slang_dict['ori'] = 'asli'
slang_dict['original'] = 'asli'

slang_dict['kw'] = 'palsu'
slang_dict['fake'] = 'palsu'

slang_dict['ok'] = 'oke'
slang_dict['okey'] = 'oke'
slang_dict['okay'] = 'oke'

slang_dict['hps'] = 'hapus'
slang_dict['hpus'] = 'hapus'
slang_dict['uninstal'] = 'hapus'
slang_dict['uninstall'] = 'hapus'

slang_dict['dikirim'] = 'pengiriman'

# Bi-gram
# Common
slang_dict['cepat selesai'] = 'cepat'

slang_dict['gak palsu'] = 'asli'
slang_dict['gak asli'] = 'palsu'
slang_dict['gak jelas'] = 'aneh'
slang_dict['gaje'] = 'aneh'

slang_dict['suka banget'] = 'cinta'

slang_dict['tebel'] = 'tebal'

slang_dict['gak suka'] = 'jelek'
slang_dict['gak enak'] = 'jelek'
slang_dict['gak bagus'] = 'jelek'

slang_dict['murah banget'] = 'murah_banget'

slang_dict['mahal banget'] = 'mahal_banget'

slang_dict['cepet banget'] = 'cepet_banget'

slang_dict['lama banget'] = 'lambat_banget'
slang_dict['lambat banget'] = 'lambat_banget'

slang_dict['bagus banget'] = 'bagus_banget'

slang_dict['jelek banget'] = 'jelek_banget'
slang_dict['sangat jelek'] = 'jelek_banget'

slang_dict['pelayanan buruk'] = 'buruk'

slang_dict['sangat puas'] = 'sangat_puas'

slang_dict['gak puas'] = 'kecewa'

# Purchase & Delivery
slang_dict['barang datang'] = "datang"
slang_dict['barang telat'] = "lambat"
slang_dict['barang cepat'] = "cepat"
slang_dict['barang rusak'] = "rusak"
slang_dict['barang oke'] = "bagus"
slang_dict['tebal banget'] = "bagus"
slang_dict['barang bagus'] = "bagus"
slang_dict['barang jelek'] = "jelek"
slang_dict['pengiriman cepat'] = "cepat"
slang_dict['pengiriman lambat'] = "lambat"
slang_dict['pengiriman aman'] = "aman"
slang_dict['pengiriman oke'] = "bagus"

def fix_slangwords(text):
    words = text.lower().split()
    
    # Step 1: Fix unigrams
    fixed_unigrams = [slang_dict.get(word, word) for word in words]
    
    # Step 2: Check for fixed bigrams
    i = 0
    final_words = []
    while i < len(fixed_unigrams):
        if i + 1 < len(fixed_unigrams):
            bigram = f"{fixed_unigrams[i]} {fixed_unigrams[i+1]}"
            if bigram in slang_dict:
                final_words.append(slang_dict[bigram])
                i += 2
                continue
        
        final_words.append(fixed_unigrams[i])
        i += 1

    return ' '.join(final_words)