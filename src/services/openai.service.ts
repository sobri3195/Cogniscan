import OpenAI from 'openai';
import { ExaminationArea } from '../types/interpretation.types';

export class OpenAIService {
  private client: OpenAI | null = null;

  constructor(apiKey: string) {
    if (apiKey) {
      this.client = new OpenAI({
        apiKey,
        dangerouslyAllowBrowser: true
      });
    }
  }

  private getPromptForArea(area: ExaminationArea): string {
    const basePrompt = `Anda adalah seorang radiolog ahli yang memberikan interpretasi medis dalam Bahasa Indonesia. Berikan interpretasi yang detail dan terstruktur sesuai format radiologi klinis Indonesia.`;

    const areaPrompts = {
      thorax: `
${basePrompt}

Untuk foto thorax, berikan interpretasi dengan format berikut:

1. IDENTITAS & TEKNIK
   - Proyeksi (AP/PA/Lateral)
   - Kualitas teknik (kV, eksposur)
   - Simetri
   - Inspirasi (hitung ICS posterior)

2. JARINGAN LUNAK & TULANG
   - Soft tissue
   - Skeletal structures
   - Costophrenic angles

3. MEDIASTINUM
   - Trakea (posisi)
   - Ukuran jantung (CTR jika memungkinkan)
   - Kontur jantung

4. PARENKIM PARU
   - Infiltrat
   - Konsolidasi
   - Pneumonia
   - Tuberkulosis
   - Efusi pleura
   - Pneumothorax
   - Atelektasis

5. IMPRESI & DIAGNOSIS
   - Kesimpulan utama
   - Diagnosis kerja

6. TINGKAT KEKHAWATIRAN (rendah/sedang/tinggi)

7. REKOMENDASI
   - Pemeriksaan lanjutan jika diperlukan
   - Konsultasi spesialis
`,
      head: `
${basePrompt}

Untuk CT Brain, berikan interpretasi dengan format berikut:

1. SOFT TISSUE & BONE WINDOW
   - Hematoma
   - Swelling
   - Fraktur calvaria
   - Diskontinuitas tulang

2. BRAIN PARENCHYMA
   - Sulcus & gyrus
   - Grey-white matter differentiation
   - Perdarahan (hiperdens/hipodens/isodens)
   - Lokasi perdarahan

3. VENTRICULAR SYSTEM
   - Ukuran ventrikel
   - Pelebaran atau penyempitan

4. CISTERNA BASALIS
   - Status cisterna

5. MIDLINE SHIFT
   - Derajat pergeseran (mm)
   - Volume perdarahan (P×L×T÷2)

6. IMPRESI & DIAGNOSIS
   - Kesimpulan utama
   - Diagnosis kerja

7. TINGKAT KEKHAWATIRAN (rendah/sedang/tinggi)

8. REKOMENDASI
   - Tindakan segera jika ada
   - Monitoring
`,
      kidney: `
${basePrompt}

Untuk pemeriksaan ginjal/abdomen, berikan interpretasi dengan format berikut:

1. GINJAL
   - Ukuran dan bentuk ginjal kanan/kiri
   - Batu ginjal (lokasi, ukuran)
   - Struktur pelvicalyceal system
   - Obstruksi
   - Hidronefrosis

2. URETER
   - Dilatasi
   - Batu ureter

3. VESIKA URINARIA
   - Bentuk dan ukuran
   - Massa
   - Batu kandung kemih
   - Air-fluid level
   - Penebalan dinding

4. SOFT TISSUE SEKITAR
   - Inflamasi
   - Massa

5. IMPRESI & DIAGNOSIS

6. TINGKAT KEKHAWATIRAN (rendah/sedang/tinggi)

7. REKOMENDASI
`,
      abdomen: `
${basePrompt}

Untuk pemeriksaan abdomen, berikan interpretasi lengkap mencakup:
- Organ solid (liver, spleen, pancreas)
- Organ berongga
- Free fluid
- Massa
- Lesi
- Impresi dan diagnosis
- Tingkat kekhawatiran
- Rekomendasi
`,
      bone: `
${basePrompt}

Untuk pemeriksaan tulang/ortopedi, berikan interpretasi mencakup:
- Alignment
- Fraktur (lokasi, jenis)
- Dislokasi
- Soft tissue swelling
- Joint space
- Impresi dan diagnosis
- Tingkat kekhawatiran
- Rekomendasi
`,
      other: `
${basePrompt}

Berikan interpretasi radiologi lengkap sesuai area yang terlihat pada gambar, mencakup:
- Temuan utama
- Abnormalitas
- Impresi dan diagnosis
- Tingkat kekhawatiran
- Rekomendasi
`
    };

    return areaPrompts[area] || areaPrompts.other;
  }

  async interpretImage(
    imageBase64: string,
    area: ExaminationArea,
    patientData: { age?: number; gender?: string; clinicalNotes?: string }
  ): Promise<string> {
    if (!this.client) {
      throw new Error('OpenAI client not initialized. Please set API key in settings.');
    }

    const prompt = this.getPromptForArea(area);
    const patientInfo = `
Data Pasien:
- Usia: ${patientData.age || 'Tidak disebutkan'}
- Jenis Kelamin: ${patientData.gender || 'Tidak disebutkan'}
- Catatan Klinis: ${patientData.clinicalNotes || 'Tidak ada'}
`;

    try {
      const response = await this.client.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: `${prompt}\n\n${patientInfo}\n\nBerikan interpretasi detail dari gambar rontgen/CT scan berikut:`
              },
              {
                type: 'image_url',
                image_url: {
                  url: imageBase64,
                  detail: 'high'
                }
              }
            ]
          }
        ],
        max_tokens: 2000,
        temperature: 0.3
      });

      const interpretation = response.choices[0]?.message?.content || 'Tidak ada interpretasi yang dihasilkan';
      return interpretation;
    } catch (error) {
      console.error('OpenAI API Error:', error);
      throw new Error(`Gagal melakukan interpretasi: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async checkImageQuality(imageBase64: string): Promise<string> {
    if (!this.client) {
      throw new Error('OpenAI client not initialized. Please set API key in settings.');
    }

    try {
      const response = await this.client.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: 'Evaluasi kualitas gambar medis ini. Berikan penilaian singkat tentang: 1) Kecerahan dan kontras, 2) Kejelasan detail anatomi, 3) Positioning, 4) Artifacts jika ada. Berikan rating kualitas: Baik/Cukup/Kurang'
              },
              {
                type: 'image_url',
                image_url: {
                  url: imageBase64,
                  detail: 'low'
                }
              }
            ]
          }
        ],
        max_tokens: 300,
        temperature: 0.2
      });

      return response.choices[0]?.message?.content || 'Tidak dapat menilai kualitas gambar';
    } catch (error) {
      console.error('Quality check error:', error);
      throw new Error('Gagal memeriksa kualitas gambar');
    }
  }
}
