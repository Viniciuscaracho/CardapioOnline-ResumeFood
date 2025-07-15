import React, { useEffect, useState } from 'react'
import { Card, CardContent } from '../components/ui/card'
import { Plus, Edit, Trash2 } from 'lucide-react'

function ProductFormModal({ open, onClose, onSubmit, initialData }) {
  const [form, setForm] = useState(initialData || { name: '', price: '', category: '', available: true, image_base64: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [preview, setPreview] = useState(initialData?.image_url || '')

  useEffect(() => {
    setForm(initialData || { name: '', price: '', category: '', available: true, image_base64: '' })
    setPreview(initialData?.image_url || '')
    setError(null)
  }, [initialData, open])

  if (!open) return null

  const handleChange = e => {
    const { name, value, type, checked, files } = e.target
    if (type === 'file' && files && files[0]) {
      const reader = new FileReader()
      reader.onload = ev => {
        setForm(f => ({ ...f, image_base64: ev.target.result }))
        setPreview(ev.target.result)
      }
      reader.readAsDataURL(files[0])
    } else {
      setForm(f => ({ ...f, [name]: type === 'checkbox' ? checked : value }))
    }
  }

  const handleSubmit = async e => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      await onSubmit(form)
      onClose()
    } catch (err) {
      setError('Erro ao salvar produto')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-2xl p-8 max-w-md w-full relative">
        <h2 className="text-xl font-bold mb-4">{initialData ? 'Editar Produto' : 'Novo Produto'}</h2>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Nome</label>
          <input name="name" value={form.name} onChange={handleChange} className="w-full border rounded px-3 py-2" required />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Preço</label>
          <input name="price" type="number" step="0.01" value={form.price} onChange={handleChange} className="w-full border rounded px-3 py-2" required />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Categoria</label>
          <input name="category" value={form.category} onChange={handleChange} className="w-full border rounded px-3 py-2" required />
        </div>
        <div className="mb-4 flex items-center gap-2">
          <input name="available" type="checkbox" checked={form.available} onChange={handleChange} id="available" />
          <label htmlFor="available" className="text-sm">Disponível</label>
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Imagem</label>
          <input name="image" type="file" accept="image/*" onChange={handleChange} className="w-full" />
          {preview && <img src={preview} alt="Preview" className="mt-2 max-h-32 rounded" />}
        </div>
        {/* Preview visual do card do menu do cliente */}
        {preview && (
          <div className="mb-4">
            <div className="bg-gray-50 rounded-lg shadow p-4 max-w-xs mx-auto border border-gray-200">
              <div className="aspect-video bg-gray-100 rounded overflow-hidden mb-2 flex items-center justify-center">
                <img src={preview} alt="Preview no menu" className="object-cover w-full h-full" />
              </div>
              <div className="font-bold text-lg text-gray-800 mb-1">{form.name || 'Nome do Produto'}</div>
              <div className="text-gray-600 text-sm mb-1">{form.category || 'Categoria'}</div>
              <div className="text-gray-500 text-xs mb-2">{form.description || 'Descrição do produto...'}</div>
              <div className="flex items-center justify-between">
                <span className="text-green-600 font-bold text-lg">R$ {form.price ? Number(form.price).toFixed(2) : '--'}</span>
                <span className={`text-xs px-2 py-1 rounded ${form.available ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{form.available ? 'Disponível' : 'Indisponível'}</span>
              </div>
              <button className="mt-3 w-full bg-green-600 text-white py-1.5 rounded hover:bg-green-700 transition text-sm font-semibold flex items-center justify-center gap-2" disabled>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
                Adicionar
              </button>
            </div>
          </div>
        )}
        {error && <div className="text-red-600 text-sm mb-2">{error}</div>}
        <div className="flex gap-2 justify-end mt-6">
          <button type="button" onClick={onClose} className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300">Cancelar</button>
          <button type="submit" disabled={loading} className="px-4 py-2 rounded bg-green-600 text-white hover:bg-green-700 disabled:opacity-60">{loading ? 'Salvando...' : 'Salvar'}</button>
        </div>
      </form>
    </div>
  )
}

export default function AdminProducts() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [modalOpen, setModalOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState(null)

  const fetchProducts = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await fetch('http://localhost:3000/api/products')
      if (!response.ok) throw new Error('Erro ao carregar produtos')
      const data = await response.json()
      setProducts(data)
    } catch (err) {
      setError('Erro ao carregar produtos')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProducts()
  }, [])

  const handleCreate = () => {
    setEditingProduct(null)
    setModalOpen(true)
  }

  const handleEdit = (product) => {
    setEditingProduct(product)
    setModalOpen(true)
  }

  const handleDelete = async (product) => {
    if (!window.confirm('Tem certeza que deseja excluir este produto?')) return
    try {
      const response = await fetch(`http://localhost:3000/api/products/${product.id}`, {
        method: 'DELETE'
      })
      if (!response.ok) throw new Error('Erro ao excluir produto')
      fetchProducts()
    } catch (err) {
      alert('Erro ao excluir produto')
    }
  }

  const handleSubmit = async (form) => {
    if (editingProduct) {
      // Editar
      const response = await fetch(`http://localhost:3000/api/products/${editingProduct.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ product: form })
      })
      if (!response.ok) throw new Error('Erro ao editar produto')
    } else {
      // Criar
      const response = await fetch('http://localhost:3000/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ product: form })
      })
      if (!response.ok) throw new Error('Erro ao criar produto')
    }
    fetchProducts()
  }

  if (loading) {
    return <div className="text-center py-20">Carregando produtos...</div>
  }
  if (error) {
    return <div className="text-center py-20 text-red-600">{error}</div>
  }

  return (
    <div className="space-y-8">
      <ProductFormModal open={modalOpen} onClose={() => setModalOpen(false)} onSubmit={handleSubmit} initialData={editingProduct} />
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Produtos</h1>
        <button onClick={handleCreate} className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition">
          <Plus className="w-5 h-5" /> Novo Produto
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map(product => (
          <Card key={product.id} className="relative">
            <CardContent className="p-6">
              {product.image_url && (
                <img src={product.image_url} alt={product.name} className="mb-2 max-h-32 rounded w-full object-cover" />
              )}
              <div className="flex items-center justify-between mb-2">
                <span className="font-semibold text-lg">{product.name}</span>
                <span className={`text-xs px-2 py-1 rounded ${product.available ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{product.available ? 'Disponível' : 'Indisponível'}</span>
              </div>
              <div className="text-gray-500 mb-4">R$ {parseFloat(product.price).toFixed(2)}</div>
              <div className="flex gap-2">
                <button className="p-2 rounded hover:bg-gray-100" onClick={() => handleEdit(product)}><Edit className="w-4 h-4" /></button>
                <button className="p-2 rounded hover:bg-gray-100" onClick={() => handleDelete(product)}><Trash2 className="w-4 h-4 text-red-500" /></button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
} 