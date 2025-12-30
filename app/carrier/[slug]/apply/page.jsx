"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import api from "@/lib/api";

export default function ApplyJobPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug;

  const [job, setJob] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    whatsapp: "",
    cv: null,
    suratLamaran: null,
    pasFoto: null,
    ktp: null,
    kartuKeluarga: null,
    ijazah: null,
    skck: null,
    sertifikat: null,
    coverLetter: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [fieldErrors, setFieldErrors] = useState({}); // Untuk tracking error per field

  // Ambil data job untuk mendapatkan ID pekerjaan
  useEffect(() => {
    const fetchJobId = async () => {
      try {
        const response = await api.get(`/jobs/${slug}`);
        setJob(response.data.data || response.data);
      } catch (err) {
        console.error("Gagal memuat info pekerjaan", err);
      }
    };
    if (slug) fetchJobId();
  }, [slug]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    
    if (files) {
      setFormData((prev) => ({
        ...prev,
        [name]: files[0],
      }));
      // Clear error untuk field ini
      setFieldErrors((prev) => ({
        ...prev,
        [name]: null,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
      // Clear error untuk field ini
      setFieldErrors((prev) => ({
        ...prev,
        [name]: null,
      }));
    }
  };

  const validateFiles = () => {
    const maxSize = 5 * 1024 * 1024; // 5MB
    const errors = {};

    // Validasi file yang wajib
    const requiredFiles = [
      { file: formData.cv, name: "cv", label: "CV" },
      { file: formData.ktp, name: "ktp", label: "KTP" },
      { file: formData.suratLamaran, name: "suratLamaran", label: "Surat Lamaran" },
      { file: formData.pasFoto, name: "pasFoto", label: "Pas Foto" }, 
      { file: formData.kartuKeluarga, name: "kartuKeluarga", label: "Kartu Keluarga" },
      { file: formData.ijazah, name: "ijazah", label: "Ijazah" },
      { file: formData.skck, name: "skck", label: "SKCK" },
    ];

    for (const { file, name, label } of requiredFiles) {
      if (!file) {
        errors[name] = `File ${label} wajib diupload`;
      } else if (file.size > maxSize) {
        errors[name] = `File ${label} melebihi batas maksimal 5MB`;
      }
    }

    // Validasi sertifikat (opsional)
    if (formData.sertifikat && formData.sertifikat.size > maxSize) {
      errors.sertifikat = `Sertifikat melebihi batas maksimal 5MB`;
    }

    // Validasi khusus untuk Pas Foto (hanya gambar)
  if (formData.pasFoto) {
    const allowedImageTypes = ['image/jpeg', 'image/jpg', 'image/png'];
    if (!allowedImageTypes.includes(formData.pasFoto.type)) {
      errors.pasFoto = 'Pas Foto harus berformat JPG, JPEG, atau PNG';
    }
  }

    // Validasi field text
    if (!formData.name.trim()) errors.name = "Nama lengkap wajib diisi";
    if (!formData.email.trim()) errors.email = "Email wajib diisi";
    if (!formData.phone.trim()) errors.phone = "No. Telepon wajib diisi";
    if (!formData.whatsapp.trim()) errors.whatsapp = "No. WhatsApp wajib diisi";

    setFieldErrors(errors);
    
    if (Object.keys(errors).length > 0) {
      setErrorMessage("Mohon lengkapi semua field yang wajib diisi");
      return false;
    }

    return true;
  };

  // Fungsi untuk mengecek apakah file sudah diupload
  const isFileUploaded = (fileName) => {
    return formData[fileName] !== null;
  };

  // Hitung jumlah file wajib yang sudah diupload
  const getUploadProgress = () => {
    const requiredFiles = ['cv', 'suratLamaran', 'pasFoto', 'ktp', 'kartuKeluarga', 'ijazah', 'skck'];
    const uploaded = requiredFiles.filter(file => isFileUploaded(file)).length;
    return { uploaded, total: requiredFiles.length };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!job) {
      setErrorMessage("Data pekerjaan belum dimuat, silakan coba lagi.");
      return;
    }

    // Validasi file sebelum submit
    if (!validateFiles()) {
      setSubmitStatus("error");
      // Scroll ke field error pertama
      const firstErrorField = document.querySelector('.border-red-500');
      if (firstErrorField) {
        firstErrorField.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus(null);
    setErrorMessage("");

    try {
      const submitData = new FormData();
      submitData.append("name", formData.name);
      submitData.append("email", formData.email);
      submitData.append("phone", formData.phone);
      submitData.append("whatsapp", formData.whatsapp);
      submitData.append("job_id", job.id);
      submitData.append("cover_letter", formData.coverLetter);

      // Upload file wajib
      if (formData.cv) submitData.append("cv", formData.cv);
      if (formData.suratLamaran) submitData.append("surat_lamaran", formData.suratLamaran);  
      if (formData.pasFoto) submitData.append("pas_foto", formData.pasFoto);                  
      if (formData.ktp) submitData.append("ktp", formData.ktp);
      if (formData.kartuKeluarga) submitData.append("kartu_keluarga", formData.kartuKeluarga);
      if (formData.ijazah) submitData.append("ijazah", formData.ijazah);
      if (formData.skck) submitData.append("skck", formData.skck);
      if (formData.sertifikat) submitData.append("sertifikat", formData.sertifikat);

      const response = await api.post("/applications", submitData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (response.data.success) {
        setSubmitStatus("success");
        
        // Reset form
        setFormData({ 
          name: "", 
          email: "", 
          phone: "", 
          whatsapp: "",
          cv: null,
          suratLamaran: null,
          pasFoto: null, 
          ktp: null,
          kartuKeluarga: null,
          ijazah: null,
          skck: null,
          sertifikat: null,
          coverLetter: "" 
        });
        
        // Reset file input elements
        const fileInputs = document.querySelectorAll('input[type="file"]');
        fileInputs.forEach(input => input.value = '');
        
        // Redirect kembali setelah sukses
        setTimeout(() => router.push(`/carrier/${slug}`), 2500);
      }
    } catch (error) {
      console.error("Submission error:", error);
      
      const errorMsg = error.response?.data?.message || error.message || "Gagal mengirim lamaran. Silakan coba lagi.";
      setErrorMessage(errorMsg);
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const progress = getUploadProgress();

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 pt-15 pb-20">
        <div className="max-w-2xl mx-auto px-4">
          <button onClick={() => router.back()} className="mb-6 flex items-center gap-2 text-blue-600 font-medium hover:underline">
            ← Kembali ke Detail Pekerjaan
          </button>

          <div className="bg-white rounded-3xl p-8 md:p-12 shadow-xl border border-gray-100">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Form Lamaran</h1>
            <p className="text-gray-500 mb-4">Posisi: <span className="font-semibold text-blue-600">{job?.title || "Memuat..."}</span></p>

            {/* Progress Indicator */}
            <div className="mb-8 p-4 bg-blue-50 rounded-xl border border-blue-100">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-semibold text-blue-800">Progress Dokumen Wajib</span>
                <span className="text-sm font-bold text-blue-600">{progress.uploaded}/{progress.total}</span>
              </div>
              <div className="w-full bg-blue-200 rounded-full h-2.5">
                <div 
                  className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
                  style={{ width: `${(progress.uploaded / progress.total) * 100}%` }}
                ></div>
              </div>
              <p className="text-xs text-blue-600 mt-2">
                {progress.uploaded === progress.total 
                  ? "✓ Semua dokumen wajib telah diupload" 
                  : `${progress.total - progress.uploaded} dokumen wajib belum diupload`}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Data Diri */}
              <div className="border-b pb-6">
                <h2 className="text-xl font-bold text-gray-800 mb-4">Data Diri</h2>
                
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Nama Lengkap *</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      placeholder="Nama lengkap sesuai identitas"
                      className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all ${
                        fieldErrors.name ? 'border-red-500 bg-red-50' : 'border-gray-300'
                      }`}
                    />
                    {fieldErrors.name && (
                      <p className="text-xs text-red-600 mt-1">⚠ {fieldErrors.name}</p>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">Email *</label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        placeholder="email@anda.com"
                        className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all ${
                          fieldErrors.email ? 'border-red-500 bg-red-50' : 'border-gray-300'
                        }`}
                      />
                      {fieldErrors.email && (
                        <p className="text-xs text-red-600 mt-1">⚠ {fieldErrors.email}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">No. Telepon *</label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        required
                        placeholder="08xxxxxxxxxx"
                        className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all ${
                          fieldErrors.phone ? 'border-red-500 bg-red-50' : 'border-gray-300'
                        }`}
                      />
                      {fieldErrors.phone && (
                        <p className="text-xs text-red-600 mt-1">⚠ {fieldErrors.phone}</p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">No. WhatsApp *</label>
                    <input
                      type="tel"
                      name="whatsapp"
                      value={formData.whatsapp}
                      onChange={handleChange}
                      required
                      placeholder="08xxxxxxxxxx"
                      className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all ${
                        fieldErrors.whatsapp ? 'border-red-500 bg-red-50' : 'border-gray-300'
                      }`}
                    />
                    {fieldErrors.whatsapp && (
                      <p className="text-xs text-red-600 mt-1">⚠ {fieldErrors.whatsapp}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Upload Dokumen */}
              <div className="border-b pb-6">
                <h2 className="text-xl font-bold text-gray-800 mb-4">Upload Dokumen</h2>
                
                <div className="space-y-6">
                  {/* KTP */}
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center justify-between">
                      <span>Upload KTP *</span>
                      {isFileUploaded('ktp') && (
                        <span className="text-xs text-green-600 font-semibold">✓ Uploaded</span>
                      )}
                    </label>
                    <input
                      type="file"
                      name="ktp"
                      onChange={handleChange}
                      accept=".jpg,.jpeg,.png,.pdf"
                      required
                      className={`w-full px-4 py-3 border rounded-xl file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 transition-all cursor-pointer ${
                        fieldErrors.ktp ? 'border-red-500 bg-red-50' : 'border-gray-300'
                      }`}
                    />
                    {formData.ktp && !fieldErrors.ktp && (
                      <p className="text-xs text-green-600 mt-1">✓ {formData.ktp.name}</p>
                    )}
                    {fieldErrors.ktp && (
                      <p className="text-xs text-red-600 mt-1">⚠ {fieldErrors.ktp}</p>
                    )}
                    {!fieldErrors.ktp && (
                      <p className="text-xs text-gray-400 mt-1">Format: PNG, JPG, atau PDF. Max: 5MB.</p>
                    )}
                  </div>

                  {/* Kartu Keluarga */}
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center justify-between">
                      <span>Upload Kartu Keluarga *</span>
                      {isFileUploaded('kartuKeluarga') && (
                        <span className="text-xs text-green-600 font-semibold">✓ Uploaded</span>
                      )}
                    </label>
                    <input
                      type="file"
                      name="kartuKeluarga"
                      onChange={handleChange}
                      accept=".jpg,.jpeg,.png,.pdf"
                      required
                      className={`w-full px-4 py-3 border rounded-xl file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 transition-all cursor-pointer ${
                        fieldErrors.kartuKeluarga ? 'border-red-500 bg-red-50' : 'border-gray-300'
                      }`}
                    />
                    {formData.kartuKeluarga && !fieldErrors.kartuKeluarga && (
                      <p className="text-xs text-green-600 mt-1">✓ {formData.kartuKeluarga.name}</p>
                    )}
                    {fieldErrors.kartuKeluarga && (
                      <p className="text-xs text-red-600 mt-1">⚠ {fieldErrors.kartuKeluarga}</p>
                    )}
                    {!fieldErrors.kartuKeluarga && (
                      <p className="text-xs text-gray-400 mt-1">Format: PNG, JPG, atau PDF. Max: 5MB.</p>
                    )}
                  </div>

                  {/* Ijazah */}
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center justify-between">
                      <span>Upload Ijazah *</span>
                      {isFileUploaded('ijazah') && (
                        <span className="text-xs text-green-600 font-semibold">✓ Uploaded</span>
                      )}
                    </label>
                    <input
                      type="file"
                      name="ijazah"
                      onChange={handleChange}
                      accept=".jpg,.jpeg,.png,.pdf"
                      required
                      className={`w-full px-4 py-3 border rounded-xl file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 transition-all cursor-pointer ${
                        fieldErrors.ijazah ? 'border-red-500 bg-red-50' : 'border-gray-300'
                      }`}
                    />
                    {formData.ijazah && !fieldErrors.ijazah && (
                      <p className="text-xs text-green-600 mt-1">✓ {formData.ijazah.name}</p>
                    )}
                    {fieldErrors.ijazah && (
                      <p className="text-xs text-red-600 mt-1">⚠ {fieldErrors.ijazah}</p>
                    )}
                    {!fieldErrors.ijazah && (
                      <p className="text-xs text-gray-400 mt-1">Format: PNG, JPG, atau PDF. Max: 5MB.</p>
                    )}
                  </div>

                  {/* SKCK */}
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center justify-between">
                      <span>Upload SKCK *</span>
                      {isFileUploaded('skck') && (
                        <span className="text-xs text-green-600 font-semibold">✓ Uploaded</span>
                      )}
                    </label>
                    <input
                      type="file"
                      name="skck"
                      onChange={handleChange}
                      accept=".jpg,.jpeg,.png,.pdf"
                      required
                      className={`w-full px-4 py-3 border rounded-xl file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 transition-all cursor-pointer ${
                        fieldErrors.skck ? 'border-red-500 bg-red-50' : 'border-gray-300'
                      }`}
                    />
                    {formData.skck && !fieldErrors.skck && (
                      <p className="text-xs text-green-600 mt-1">✓ {formData.skck.name}</p>
                    )}
                    {fieldErrors.skck && (
                      <p className="text-xs text-red-600 mt-1">⚠ {fieldErrors.skck}</p>
                    )}
                    {!fieldErrors.skck && (
                      <p className="text-xs text-gray-400 mt-1">Format: PNG, JPG, atau PDF. Max: 5MB.</p>
                    )}
                  </div>

                  {/* Surat Lamaran */}
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center justify-between">
                        <span>Upload Surat Lamaran *</span>
                        {isFileUploaded('suratLamaran') && (
                          <span className="text-xs text-green-600 font-semibold">✓ Uploaded</span>
                        )}
                      </label>
                      <input
                        type="file"
                        name="suratLamaran"
                        onChange={handleChange}
                        accept=".pdf"
                        required
                        className={`w-full px-4 py-3 border rounded-xl file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 transition-all cursor-pointer ${
                          fieldErrors.suratLamaran ? 'border-red-500 bg-red-50' : 'border-gray-300'
                        }`}
                      />
                      {formData.suratLamaran && !fieldErrors.suratLamaran && (
                        <p className="text-xs text-green-600 mt-1">✓ {formData.suratLamaran.name}</p>
                      )}
                      {fieldErrors.suratLamaran && (
                        <p className="text-xs text-red-600 mt-1">⚠ {fieldErrors.suratLamaran}</p>
                      )}
                      {!fieldErrors.suratLamaran && (
                        <p className="text-xs text-gray-400 mt-1">Format: PDF. Max: 5MB.</p>
                      )}
                    </div>

                    {/* Pas Foto */}
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center justify-between">
                        <span>Upload Pas Foto *</span>
                        {isFileUploaded('pasFoto') && (
                          <span className="text-xs text-green-600 font-semibold">✓ Uploaded</span>
                        )}
                      </label>
                      <input
                        type="file"
                        name="pasFoto"
                        onChange={handleChange}
                        accept=".jpg,.jpeg,.png"
                        required
                        className={`w-full px-4 py-3 border rounded-xl file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 transition-all cursor-pointer ${
                          fieldErrors.pasFoto ? 'border-red-500 bg-red-50' : 'border-gray-300'
                        }`}
                      />
                      {formData.pasFoto && !fieldErrors.pasFoto && (
                        <p className="text-xs text-green-600 mt-1">✓ {formData.pasFoto.name}</p>
                      )}
                      {fieldErrors.pasFoto && (
                        <p className="text-xs text-red-600 mt-1">⚠ {fieldErrors.pasFoto}</p>
                      )}
                      {!fieldErrors.pasFoto && (
                        <p className="text-xs text-gray-400 mt-1">Format: JPG, JPEG, atau PNG. Max: 5MB. Ukuran ideal: 3x4 atau 4x6.</p>
                      )}
                    </div>

                  {/* CV */}
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center justify-between">
                      <span>Upload CV *</span>
                      {isFileUploaded('cv') && (
                        <span className="text-xs text-green-600 font-semibold">✓ Uploaded</span>
                      )}
                    </label>
                    <input
                      type="file"
                      name="cv"
                      onChange={handleChange}
                      accept=".pdf"
                      required
                      className={`w-full px-4 py-3 border rounded-xl file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 transition-all cursor-pointer ${
                        fieldErrors.cv ? 'border-red-500 bg-red-50' : 'border-gray-300'
                      }`}
                    />
                    {formData.cv && !fieldErrors.cv && (
                      <p className="text-xs text-green-600 mt-1">✓ {formData.cv.name}</p>
                    )}
                    {fieldErrors.cv && (
                      <p className="text-xs text-red-600 mt-1">⚠ {fieldErrors.cv}</p>
                    )}
                    {!fieldErrors.cv && (
                      <p className="text-xs text-gray-400 mt-1">Format: PDF. Max: 5MB.</p>
                    )}
                  </div>

                  {/* Sertifikat (Opsional) */}
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center justify-between">
                      <span>Upload Sertifikat (Opsional)</span>
                      {isFileUploaded('sertifikat') && (
                        <span className="text-xs text-green-600 font-semibold">✓ Uploaded</span>
                      )}
                    </label>
                    <input
                      type="file"
                      name="sertifikat"
                      onChange={handleChange}
                      accept=".pdf"
                      className={`w-full px-4 py-3 border rounded-xl file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 transition-all cursor-pointer ${
                        fieldErrors.sertifikat ? 'border-red-500 bg-red-50' : 'border-gray-300'
                      }`}
                    />
                    {formData.sertifikat && !fieldErrors.sertifikat && (
                      <p className="text-xs text-green-600 mt-1">✓ {formData.sertifikat.name}</p>
                    )}
                    {fieldErrors.sertifikat && (
                      <p className="text-xs text-red-600 mt-1">⚠ {fieldErrors.sertifikat}</p>
                    )}
                    {!fieldErrors.sertifikat && (
                      <p className="text-xs text-gray-400 mt-1">Format: PDF. Max: 5MB.</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Cover Letter */}
              <div>
                <h2 className="text-xl font-bold text-gray-800 mb-4">Deskripsi Singkat (Tentang Diri) </h2>
                <textarea
                  name="coverLetter"
                  value={formData.coverLetter}
                  onChange={handleChange}
                  rows="5"
                  placeholder="Sampaikan mengapa Anda kandidat yang tepat untuk posisi ini..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all resize-none"
                ></textarea>
              </div>

              {submitStatus === "success" && (
                <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-xl flex items-center gap-2">
                  <span>✅ Lamaran berhasil dikirim! Anda akan dialihkan...</span>
                </div>
              )}

              {submitStatus === "error" && (
                <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-xl">
                  <p className="font-semibold">❌ Gagal mengirim lamaran</p>
                  {errorMessage && <p className="text-sm mt-1">{errorMessage}</p>}
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting || !job}
                className="w-full py-4 bg-gradient-to-r from-blue-600 to-blue-800 text-white font-bold rounded-xl shadow-lg hover:shadow-blue-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? "Sedang Mengirim..." : "Kirim Lamaran"}
              </button>
            </form>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}