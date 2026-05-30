import React, { useEffect, useMemo, useState } from 'react';
import productApi from '../../services/productApi';
import { getBrands, getCategories, getSubCategoriesByCategory } from '../../services/brandCategoryApi';
import { FaTimes } from 'react-icons/fa'; // Import clean cross icon

const STATUS_OPTIONS = ['ACTIVE', 'INACTIVE', 'DRAFT'];
const CONDITION_OPTIONS = ['NEW', 'REFURBISHED', 'USED'];

function ProductForm({ initialData = null, onClose, onSaved }) {
  const [form, setForm] = useState({
    name: '',
    description: '',
    mrp_price: '',
    stockQuantity: '',
    gstPercentage: '',
    discountPercentage: '',
    deliveryTimeInDays: 0,
    productStatus: 'ACTIVE',
    productCondition: 'NEW',
    brandId: '',
    categoryId: '',
    subCategoryId: '',
  });

  const [attributes, setAttributes] = useState([{ key: '', value: '' }]);
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [brands, setBrands] = useState([]);
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);

  useEffect(() => {
    if (!initialData) return;

    setForm({
      name: initialData.name || '',
      description: initialData.description || '',
      mrp_price: initialData.mrp_price || '',
      stockQuantity: initialData.stockQuantity || '',
      gstPercentage: initialData.gstPercentage || '',
      discountPercentage: initialData.discountPercentage || '',
      deliveryTimeInDays: initialData.deliveryTimeInDays || 0,
      productStatus: initialData.productStatus || 'ACTIVE',
      productCondition: initialData.productCondition || 'NEW',
      brandId: initialData.brand?.id || '',
      categoryId: initialData.category?.id || '',
      subCategoryId: initialData.subCategory?.id || '',
    });

    if (initialData.attributes) {
      const entries = Object.entries(initialData.attributes).map(([key, value]) => ({ key, value }));
      setAttributes(entries.length ? entries : [{ key: '', value: '' }]);
    }
  }, [initialData]);

  const validAttributes = useMemo(
    () => attributes.filter((attr) => attr.key.trim() !== ''),
    [attributes]
  );

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'categoryId') {
      setForm((prev) => ({ ...prev, [name]: value, subCategoryId: '' }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  useEffect(() => {
    let mounted = true;

    const load = async () => {
      try {
        const [bRes, cRes] = await Promise.all([getBrands(), getCategories()]);
        if (!mounted) return;
        setBrands(Array.isArray(bRes) ? bRes : []);
        setCategories(Array.isArray(cRes) ? cRes : []);
      } catch (err) {
        console.error('Failed to load brands/categories', err);
      }
    };

    load();

    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    let mounted = true;
    const catId = form.categoryId;
    if (!catId) {
      setSubCategories([]);
      return;
    }

    const loadSub = async () => {
      try {
        const res = await getSubCategoriesByCategory(catId);
        if (!mounted) return;
        setSubCategories(Array.isArray(res) ? res : []);
      } catch (err) {
        console.error('Failed to load subcategories', err);
        setSubCategories([]);
      }
    };

    loadSub();

    return () => {
      mounted = false;
    };
  }, [form.categoryId]);

  const handleAttributeChange = (index, field, value) => {
    setAttributes((prev) => prev.map((attr, idx) => (idx === index ? { ...attr, [field]: value } : attr)));
  };

  const addAttribute = () => {
    setAttributes((prev) => [...prev, { key: '', value: '' }]);
  };

  const removeAttribute = (index) => {
    setAttributes((prev) => prev.filter((_, idx) => idx !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.name.trim() || !form.mrp_price) {
      alert('Product name and MRP price are required');
      return;
    }

    const attributesObject = validAttributes.reduce((acc, attr) => {
      if (attr.key.trim()) acc[attr.key.trim()] = attr.value;
      return acc;
    }, {});

    const payload = {
      name: form.name,
      description: form.description,
      mrp_price: Number(form.mrp_price),
      stockQuantity: Number(form.stockQuantity) || 0,
      gstPercentage: Number(form.gstPercentage) || 0,
      discountPercentage: Number(form.discountPercentage) || 0,
      deliveryTimeInDays: Number(form.deliveryTimeInDays) || 0,
      productStatus: form.productStatus,
      productCondition: form.productCondition,
      brand: form.brandId ? { id: Number(form.brandId) } : null,
      category: form.categoryId ? { id: Number(form.categoryId) } : null,
      subCategory: form.subCategoryId ? { id: Number(form.subCategoryId) } : null,
      attributes: attributesObject,
    };

    try {
      setLoading(true);
      if (initialData?.id) {
        await productApi.updateProduct(initialData.id, payload, file);
        alert('Product updated successfully');
      } else {
        await productApi.createProduct(payload, file);
        alert('Product created successfully');
      }
      onSaved?.();
      onClose?.();
    } catch (error) {
      console.error(error);
      const resp = error?.response;
      const msg = resp
        ? resp.status === 403
          ? 'Unauthorized: please log in with an admin account to save products.'
          : `${resp.status} ${resp.statusText} - ${typeof resp.data === 'string' ? resp.data : JSON.stringify(resp.data)}`
        : error.message || 'Unable to save product';
      alert(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="product-form-card">
      {/* 👑 Top Header: Form titles on left, interactive cross icon button on right corner */}
      <div className="product-form-card-header">
        <div>
          <h3>{initialData ? 'Edit Product' : 'Add Product'}</h3>
          <p>Enter product details and optional attributes below.</p>
        </div>
        
        {/* ❌ Interactive Close Button */}
        <button type="button" className="modal-close-icon-btn" onClick={onClose} aria-label="Close Form">
          <FaTimes />
        </button>
      </div>

      <form className="product-form-sheet" onSubmit={handleSubmit}>
        <div className="form-grid">
          <div className="form-field">
            <label>Name *</label>
            <input name="name" value={form.name} onChange={handleChange} />
          </div>

          <div className="form-field">
            <label>MRP Price *</label>
            <input name="mrp_price" type="number" step="0.01" value={form.mrp_price} onChange={handleChange} />
          </div>

          <div className="form-field">
            <label>Stock Quantity</label>
            <input name="stockQuantity" type="number" value={form.stockQuantity} onChange={handleChange} />
          </div>

          <div className="form-field">
            <label>GST Percentage</label>
            <input name="gstPercentage" type="number" step="0.01" value={form.gstPercentage} onChange={handleChange} />
          </div>

          <div className="form-field">
            <label>Discount Percentage (%)</label>
            <input name="discountPercentage" type="number" step="0.01" placeholder="0" value={form.discountPercentage} onChange={handleChange} />
          </div>

          <div className="form-field">
            <label>Delivery Days</label>
            <input name="deliveryTimeInDays" type="number" value={form.deliveryTimeInDays} onChange={handleChange} />
          </div>

          <div className="form-field">
              <label>Brand</label>
              <select name="brandId" value={form.brandId} onChange={handleChange}>
                <option value="">Select brand</option>
                {brands.map((b) => (
                  <option key={b.id} value={b.id}>{b.name}</option>
                ))}
              </select>
          </div>

          <div className="form-field">
              <label>Category</label>
              <select name="categoryId" value={form.categoryId} onChange={handleChange}>
                <option value="">Select category</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
          </div>

          <div className="form-field">
            <label>Sub Category</label>
            <select name="subCategoryId" value={form.subCategoryId || ''} onChange={handleChange}>
              <option value="">Select subcategory</option>
              {subCategories.map((s) => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </select>
          </div>

          <div className="form-field">
            <label>Product Status</label>
            <select name="productStatus" value={form.productStatus} onChange={handleChange}>
              {STATUS_OPTIONS.map((option) => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          </div>

          <div className="form-field">
            <label>Product Condition</label>
            <select name="productCondition" value={form.productCondition} onChange={handleChange}>
              {CONDITION_OPTIONS.map((option) => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="form-field full-width">
          <label>Description</label>
          <textarea name="description" value={form.description} onChange={handleChange} rows={4} />
        </div>

        <div className="form-field full-width">
          <label>Product Image</label>
          <input type="file" onChange={(e) => setFile(e.target.files[0])} />
        </div>

        <div className="attributes-section">
          <div className="attributes-header">
            <h4>Attributes</h4>
            <button type="button" className="secondary-button" onClick={addAttribute}>
              + Add Attribute
            </button>
          </div>

          {attributes.map((attribute, index) => (
            <div key={index} className="attribute-row">
              <div className="form-field">
                <label>Key</label>
                <input
                  value={attribute.key}
                  onChange={(e) => handleAttributeChange(index, 'key', e.target.value)}
                  placeholder="color"
                />
              </div>
              <div className="form-field">
                <label>Value</label>
                <input
                  value={attribute.value}
                  onChange={(e) => handleAttributeChange(index, 'value', e.target.value)}
                  placeholder="red"
                />
              </div>
              <button type="button" className="danger-button small" onClick={() => removeAttribute(index)}>
                Remove
              </button>
            </div>
          ))}
        </div>

        <div className="form-actions">
          <button type="submit" className="primary-button" disabled={loading}>
            {loading ? 'Saving...' : 'Save Product'}
          </button>
          <button type="button" className="secondary-button" onClick={onClose}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

export default ProductForm;