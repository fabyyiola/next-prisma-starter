// src/components/forms/unidadForm.tsx

import React, { useState, useEffect } from 'react';
import { Unidad } from '@/types/schema.types';
import { createUnidad, updateUnidad } from '@/apiCalls/unidadApi';

interface UnidadFormProps {
  unidad?: Unidad;
  onSubmit: (unidad: Unidad) => void;
  onCancel: () => void;
}

export default function UnidadForm({ unidad, onSubmit, onCancel }: UnidadFormProps) {
  const [formData, setFormData] = useState<Unidad>({
    ID: unidad?.ID || 0,
    NoEconomico: unidad?.NoEconomico || 0,
    Placas: unidad?.Placas || '',
    Marca: unidad?.Marca || '',
    Modelo: unidad?.Modelo || '',
    Tipo: unidad?.Tipo || '',
    VerMecanica: unidad?.VerMecanica || new Date(),
    VerContaminantes: unidad?.VerContaminantes || new Date(),
    VerUS: unidad?.VerUS || new Date(),
    PolizaUS: unidad?.PolizaUS || new Date(),
    PolizaMX: unidad?.PolizaMX || new Date()
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: new Date(value) });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (unidad) {
      await updateUnidad(unidad.ID, formData);
    } else {
      await createUnidad(formData);
    }
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>No Economico</label>
        <input
          type="number"
          name="NoEconomico"
          value={formData.NoEconomico}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <label>Placas</label>
        <input
          type="text"
          name="Placas"
          value={formData.Placas}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <label>Marca</label>
        <input
          type="text"
          name="Marca"
          value={formData.Marca}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <label>Modelo</label>
        <input
          type="text"
          name="Modelo"
          value={formData.Modelo}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <label>Tipo</label>
        <input
          type="text"
          name="Tipo"
          value={formData.Tipo}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <label>Verificación Mecánica</label>
        <input
          type="date"
          name="VerMecanica"
          value={formData.VerMecanica.toISOString().split('T')[0]}
          onChange={handleDateChange}
          required
        />
      </div>
      <div>
        <label>Verificación Contaminantes</label>
        <input
          type="date"
          name="VerContaminantes"
          value={formData.VerContaminantes.toISOString().split('T')[0]}
          onChange={handleDateChange}
          required
        />
      </div>
      <div>
        <label>Verificación US</label>
        <input
          type="date"
          name="VerUS"
          value={formData.VerUS.toISOString().split('T')[0]}
          onChange={handleDateChange}
          required
        />
      </div>
      <div>
        <label>Póliza US</label>
        <input
          type="date"
          name="PolizaUS"
          value={formData.PolizaUS.toISOString().split('T')[0]}
          onChange={handleDateChange}
          required
        />
      </div>
      <div>
        <label>Póliza MX</label>
        <input
          type="date"
          name="PolizaMX"
          value={formData.PolizaMX.toISOString().split('T')[0]}
          onChange={handleDateChange}
          required
        />
      </div>
      <button type="submit">Save</button>
      <button type="button" onClick={onCancel}>Cancel</button>
    </form>
  );
}
