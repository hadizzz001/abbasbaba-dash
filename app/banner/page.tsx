'use client';

import { useState, useEffect } from 'react'; 
import Upload from '../components/Upload';
import { redirect, useRouter } from 'next/navigation';

const ManageCategory = () => {
  const [formData, setFormData] = useState({  img: [] });
  const [editFormData, setEditFormData] = useState({ id: '',  img: [] });
  const [message, setMessage] = useState('');
  const [categories, setCategories] = useState([]);
  const [img, setImg] = useState([]); // Store images in an array
  const [editMode, setEditMode] = useState(false);
  const router = useRouter();
  // Fetch all categories
  const fetchCategories = async () => {
    try {
      const res = await fetch('/api/banner', { method: 'GET' });
      if (res.ok) {
        const data = await res.json();
        setCategories(data);
      } else {
        console.error('Failed to fetch categories');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // Add category
  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await fetch('/api/banner', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });

    if (res.ok) {
      setMessage('Brand added successfully!');
      setFormData({   img: [] });
      fetchCategories();
      window.location.href = '/banner';
      
    } else {
      const errorData = await res.json();
      setMessage(`Error: ${errorData.error}`);
    }
  };

  // Edit category
  const handleEdit = (category) => {
    setEditMode(true);
    setEditFormData({
      id: category.id, 
      img: category.img,
    });
    setImg(category.img); // Populate img state with existing images for editing
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
  
    try {
      const res = await fetch(`/api/banner?id=${encodeURIComponent(editFormData.id)}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          img: img, // Sends only the new image array
        }),
      });
  
      if (res.ok) {
        // Clear the edit form and image state
        setEditFormData({ id: '',  img: [] });
        setImg([]); // Remove all old images from state
        setEditMode(false);
        fetchCategories();
        window.location.reload();
      } else {
        const errorData = await res.json();
        setMessage(`Error: ${errorData.error}`);
        window.location.reload();
      }
    } catch (error) {
      console.error('Error:', error);
      setMessage('An error occurred while updating the banner.');
    }
  };
  

  // Delete category
  const handleDelete = async (id) => {
    if (confirm(`Are you sure you want to delete this banner?`)) {
      try {
        const res = await fetch(`/api/banner?id=${encodeURIComponent(id)}`, {
          method: 'DELETE',
        });
        if (res.ok) {
          setMessage('banner deleted successfully!');
          fetchCategories();
          redirect('/banner');
        } else {
          const errorData = await res.json();
          setMessage(`Error: ${errorData.error}`);
        }
      } catch (error) {
        console.error('Error:', error);
      }
    }
  };

  const handleImgChange = (uploadedUrls) => {
    if (uploadedUrls && uploadedUrls.length > 0) {
      // Replace old images with new ones
      setImg(uploadedUrls);
    }
  };
  

  useEffect(() => {
    if (!img.includes('')) {
      setFormData((prevState) => ({ ...prevState, img }));
    }
  }, [img]);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">{editMode ? 'Edit Banner' : 'Add Banner'}</h1>
      <form onSubmit={editMode ? handleEditSubmit : handleSubmit} className="space-y-4">
    
       
        
        <Upload onImagesUpload={handleImgChange} />
        <button type="submit" className="bg-blue-500 text-white px-4 py-2">
          {editMode ? 'Update Banner' : 'Add Banner'}
        </button>
      </form>
      {message && <p className="mt-4">{message}</p>}

      <h2 className="text-xl font-bold mt-8">Banner</h2>
      <table className="table-auto border-collapse border border-gray-300 w-full mt-4">
        <thead>
          <tr> 
            <th className="border border-gray-300 p-2">Image</th>
            <th className="border border-gray-300 p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {categories.length > 0 ? (
            categories.map((category) => (
              <tr key={category.id}> 
                <td className="border border-gray-300 p-2"><img src={`api/proxy?url=${category.img[0]}`}  alt="Product Image" className="w-24 h-auto" /></td>
                <td className="border border-gray-300 p-2 text-center">
                  <button
                    onClick={() => handleEdit(category)}
                    className="bg-yellow-500 text-white px-4 py-1 rounded mr-2"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(category.id)}
                    className="bg-red-500 text-white px-4 py-1 rounded"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td  className="border border-gray-300 p-2 text-center">
                No Banner found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
      <style
          dangerouslySetInnerHTML={{
            __html:
              "\n  .uploadcare--widget {\n    background:black;\n  }\n  ",
          }}
        />
    </div>
  );
};

export default ManageCategory;
