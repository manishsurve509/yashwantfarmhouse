import React, { useState, useEffect, useRef } from 'react';
import {
  UploadCloud,
  Image as ImageIcon,
  Star,
  Trash2,
  CheckCircle2,
  AlertCircle,
  FileCheck,
  RefreshCw,
  Plus,
  ExternalLink
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useSiteData } from '../context/SiteContext';
import { safeFetch } from '../utils/api';

export default function AdminGallery() {
  const { token } = useAuth();
  const { gallery, refreshData } = useSiteData();

  const [photosList, setPhotosList] = useState([]);
  const fileInputRef = useRef(null);
  const [dragActive, setDragActive] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Category and caption for upload
  const [uploadCategory, setUploadCategory] = useState('Property');
  const [uploadCaption, setUploadCaption] = useState('');

  const fetchPhotos = async () => {
    try {
      const res = await safeFetch('/api/gallery');
      if (res.ok && res.data?.success && Array.isArray(res.data?.photos)) {
        setPhotosList(res.data.photos);
      } else if (Array.isArray(gallery) && gallery.length > 0) {
        setPhotosList(gallery);
      }
    } catch (err) {
      console.error(err);
      if (Array.isArray(gallery) && gallery.length > 0) setPhotosList(gallery);
    }
  };

  useEffect(() => {
    fetchPhotos();
  }, []);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 4000);
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const validateFiles = (files) => {
    const validExts = ['image/jpeg', 'image/png', 'image/webp', 'image/avif', 'image/jpg'];
    const maxBytes = 10 * 1024 * 1024; // 10MB
    const valid = [];

    for (const f of files) {
      if (!validExts.includes(f.type.toLowerCase())) {
        setErrorMessage(`File ${f.name} is not an allowed format. Please upload JPEG, PNG, WEBP, or AVIF.`);
        return [];
      }
      if (f.size > maxBytes) {
        setErrorMessage(`File ${f.name} exceeds the 10MB limit.`);
        return [];
      }
      valid.push(f);
    }
    setErrorMessage('');
    return valid;
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const valid = validateFiles(Array.from(e.dataTransfer.files));
      if (valid.length > 0) {
        setSelectedFiles(valid);
      }
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const valid = validateFiles(Array.from(e.target.files));
      if (valid.length > 0) {
        setSelectedFiles(valid);
      }
    }
  };

  const handleUploadSubmit = async (e) => {
    e.preventDefault();
    if (selectedFiles.length === 0) return;

    setUploading(true);
    setErrorMessage('');

    const formData = new FormData();
    selectedFiles.forEach((file) => {
      formData.append('images', file);
    });
    formData.append('category', uploadCategory);
    formData.append('altText', uploadCaption);

    try {
      const res = await safeFetch('/api/gallery/upload', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      if (!res.ok || !res.data?.success) {
        throw new Error(res.error || res.data?.message || 'Upload failed');
      }

      await fetchPhotos();
      await refreshData();
      setSelectedFiles([]);
      setUploadCaption('');
      showToast(`Successfully uploaded ${res.data.photos?.length || selectedFiles.length} photo(s)!`);
    } catch (err) {
      setErrorMessage(err.message || 'Error uploading photos.');
    } finally {
      setUploading(false);
    }
  };

  const handleToggleFeature = async (id) => {
    try {
      const res = await safeFetch(`/api/gallery/${id}/feature`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (res.ok && res.data?.success) {
        await fetchPhotos();
        await refreshData();
        showToast(res.data.message);
      } else {
        alert(res.error || 'Failed to update feature status');
      }
    } catch (err) {
      alert(err.message);
    }
  };

  const handleDeletePhoto = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete ${name}?`)) return;

    try {
      const res = await safeFetch(`/api/gallery/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (res.ok && res.data?.success) {
        await fetchPhotos();
        await refreshData();
        showToast('Photo removed successfully.');
      } else {
        alert(res.error || 'Failed to delete photo');
      }
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl font-bold text-[#163624]">
            Farmhouse Photos & Gallery
          </h1>
          <p className="text-sm text-[#6B726D] mt-1">
            Upload high-resolution property photos, mark featured hero images, and organize photo categories.
          </p>
        </div>

        <button
          onClick={() => refreshData()}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-[#E5DFD7] text-xs font-semibold text-[#163624] hover:bg-[#FAF8F5] transition-colors self-start sm:self-auto"
        >
          <RefreshCw className="w-3.5 h-3.5 text-[#C69A52]" />
          <span>Sync Gallery</span>
        </button>
      </div>

      {/* Toast Alert */}
      {toastMessage && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs sm:text-sm flex items-center gap-3 animate-fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Error Alert */}
      {errorMessage && (
        <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-800 text-xs sm:text-sm flex items-center gap-3 animate-fade-in">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Modern Drag-and-Drop Upload Component */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E5DFD7] card-shadow">
        
        <form onSubmit={handleUploadSubmit} className="space-y-6">
          
          <div
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-3xl p-8 sm:p-12 text-center cursor-pointer transition-all duration-200 ${
              dragActive
                ? 'border-[#163624] bg-[#E7EFEA]'
                : 'border-[#E5DFD7] hover:border-[#C69A52] bg-[#FAF8F5]/60'
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/jpeg,image/png,image/webp,image/avif"
              onChange={handleFileChange}
              className="hidden"
            />

            <div className="w-16 h-16 rounded-full bg-white shadow-sm border border-[#E5DFD7] flex items-center justify-center mx-auto mb-4 text-[#163624]">
              <UploadCloud className="w-8 h-8 text-[#1F4A32]" />
            </div>

            <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#163624] mb-1">
              Upload Farmhouse Photos
            </h3>

            <p className="text-sm text-[#6B726D] mb-4">
              Drag & drop images here, or <span className="text-[#163624] font-semibold underline">Choose Photos</span>
            </p>

            <div className="inline-flex items-center gap-2 text-[11px] text-[#796E64] bg-white px-3 py-1 rounded-full border border-[#E5DFD7]">
              <span>Supported: JPEG, PNG, WEBP, AVIF</span>
              <span>•</span>
              <span>Max: 10MB per file</span>
            </div>
          </div>

          {/* Selected Files Ready To Upload */}
          {selectedFiles.length > 0 && (
            <div className="p-4 rounded-2xl bg-[#E7EFEA] border border-[#C69A52]/30 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase text-[#163624]">
                  {selectedFiles.length} Photo(s) Selected
                </span>
                <button
                  type="button"
                  onClick={() => setSelectedFiles([])}
                  className="text-xs text-red-600 hover:underline"
                >
                  Clear Selection
                </button>
              </div>

              {/* Upload Meta Inputs */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-semibold uppercase text-[#796E64] mb-1">
                    Photo Category
                  </label>
                  <select
                    value={uploadCategory}
                    onChange={(e) => setUploadCategory(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-[#E5DFD7] bg-white"
                  >
                    <option value="Property">Property & Villa</option>
                    <option value="Pool">Swimming Pool</option>
                    <option value="Nature">Nature & Lawn</option>
                    <option value="Brand">Branding</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold uppercase text-[#796E64] mb-1">
                    Caption / Alt Text
                  </label>
                  <input
                    type="text"
                    value={uploadCaption}
                    onChange={(e) => setUploadCaption(e.target.value)}
                    placeholder="e.g. Sunny morning by the swimming pool"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-[#E5DFD7] bg-white"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={uploading}
                className="w-full py-3 px-6 rounded-full bg-[#163624] hover:bg-[#102419] text-white font-semibold text-xs uppercase tracking-wider transition-all shadow disabled:opacity-50 flex items-center justify-center gap-2"
              >
                <FileCheck className="w-4 h-4 text-[#C69A52]" />
                <span>{uploading ? 'Uploading to Server...' : `Upload ${selectedFiles.length} Photo(s) Now`}</span>
              </button>
            </div>
          )}

        </form>

      </div>

      {/* Photos Grid with Preview, Filename, Featured Status, Delete Button */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#163624]">
            Current Photos ({photosList.length > 0 ? photosList.length : (gallery?.length || 0)})
          </h2>
          <span className="text-xs text-[#796E64]">
            ⭐ Starred items appear as Featured on the homepage
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {(photosList.length > 0 ? photosList : (Array.isArray(gallery) ? gallery : [])).map((photo) => (
            <div
              key={photo._id}
              className="bg-white rounded-3xl overflow-hidden border border-[#E5DFD7] card-shadow card-shadow-hover flex flex-col justify-between"
            >
              {/* Thumbnail Container */}
              <div className="relative h-48 bg-[#FAF8F5] overflow-hidden group">
                <img
                  src={photo.imageUrl}
                  alt={photo.altText}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />

                {/* Featured Badge Overlay */}
                {photo.featured && (
                  <div className="absolute top-3 left-3 bg-[#163624] text-[#FAF8F5] text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full flex items-center gap-1 shadow-md border border-[#C69A52]/40">
                    <Star className="w-3 h-3 text-[#C69A52] fill-[#C69A52]" />
                    <span>Featured</span>
                  </div>
                )}

                <div className="absolute top-3 right-3 bg-black/50 backdrop-blur-sm text-white text-[10px] px-2 py-0.5 rounded-md">
                  {photo.category || 'Property'}
                </div>
              </div>

              {/* Photo Details */}
              <div className="p-4 flex-1 flex flex-col justify-between">
                <div>
                  <p className="font-serif text-base font-bold text-[#163624] line-clamp-1 mb-1">
                    {photo.altText || photo.imageName}
                  </p>
                  <p className="text-[11px] text-[#796E64] truncate">
                    File: {photo.imageName}
                  </p>
                </div>

                {/* Card Action Controls */}
                <div className="pt-4 mt-3 border-t border-[#F3EFE9] flex items-center justify-between gap-2">
                  <button
                    onClick={() => handleToggleFeature(photo._id)}
                    className={`flex-1 py-1.5 px-2.5 rounded-xl text-xs font-semibold flex items-center justify-center gap-1 transition-colors border ${
                      photo.featured
                        ? 'bg-[#C69A52]/10 text-[#C69A52] border-[#C69A52]/40 hover:bg-[#C69A52]/20'
                        : 'bg-[#FAF8F5] text-[#796E64] border-[#E5DFD7] hover:text-[#163624]'
                    }`}
                  >
                    <Star className={`w-3.5 h-3.5 ${photo.featured ? 'fill-[#C69A52] text-[#C69A52]' : ''}`} />
                    <span>{photo.featured ? 'Featured' : 'Feature'}</span>
                  </button>

                  <button
                    onClick={() => handleDeletePhoto(photo._id, photo.imageName)}
                    className="p-1.5 rounded-xl text-rose-600 hover:bg-rose-50 border border-rose-200 transition-colors"
                    title="Delete photo"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
