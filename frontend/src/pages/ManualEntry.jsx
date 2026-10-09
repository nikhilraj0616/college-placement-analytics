import { useState } from 'react'
import { useForm } from 'react-hook-form'
import client from '../api/client'

const BRANCHES = ['CSE', 'ECE', 'Mechanical', 'Civil', 'Chemical']
const SECTORS = ['IT', 'Core', 'Finance', 'Consulting', 'PSU']
const COMPANY_TYPES = ['MNC', 'Startup', 'Government']

const fieldStyle = {
  width: '100%', padding: '8px 12px', border: '1px solid #d1d5db',
  borderRadius: 6, fontSize: 13, outline: 'none', marginTop: 4,
}
const labelStyle = { fontSize: 13, fontWeight: 500, display: 'block' }

export default function ManualEntry() {
  const { register, handleSubmit, reset, formState: { errors } } = useForm()
  const [companies, setCompanies] = useState([])
  const [success, setSuccess] = useState('')
  const [error, setError] = useState('')

  const onSubmit = async (formData) => {
    setSuccess(''); setError('')
    try {
      // 1. Upsert company
      const compRes = await client.post('/companies', {
        name: formData.company_name,
        sector: formData.sector,
        type: formData.company_type,
      })
      const companyId = compRes.data.id

      // 2. Create student
      const studRes = await client.post('/students', {
        name: formData.name,
        roll_number: formData.roll_number,
        branch: formData.branch,
        cgpa: parseFloat(formData.cgpa),
        graduation_year: parseInt(formData.graduation_year),
      })
      const studentId = studRes.data.id

      // 3. Create placement
      await client.post('/placements', {
        student_id: studentId,
        company_id: companyId,
        job_role: formData.job_role,
        package_lpa: parseFloat(formData.package_lpa),
        offer_type: formData.offer_type,
        placement_date: formData.placement_date,
        status: formData.status,
      })

      setSuccess(`✅ Record for ${formData.name} saved successfully!`)
      reset()
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to save record')
    }
  }

  return (
    <div>
      <div className="page-title">✏️ Manual Entry</div>
      <p style={{ color: '#57606a', marginBottom: 20 }}>Add individual student placement records manually.</p>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid-2" style={{ marginBottom: 16 }}>
          {/* Student Info */}
          <div className="card">
            <div style={{ fontWeight: 700, marginBottom: 12, color: '#1F4E79' }}>Student Information</div>
            {[
              { name: 'name', label: 'Full Name', placeholder: 'e.g. Aarav Sharma' },
              { name: 'roll_number', label: 'Roll Number', placeholder: 'e.g. CS001' },
              { name: 'graduation_year', label: 'Graduation Year', placeholder: '2024', type: 'number' },
              { name: 'cgpa', label: 'CGPA', placeholder: '8.5', type: 'number', step: '0.01' },
            ].map(f => (
              <div key={f.name} style={{ marginBottom: 12 }}>
                <label style={labelStyle}>{f.label}</label>
                <input type={f.type || 'text'} step={f.step} placeholder={f.placeholder}
                  {...register(f.name, { required: true })}
                  style={{ ...fieldStyle, borderColor: errors[f.name] ? '#dc2626' : '#d1d5db' }}
                />
              </div>
            ))}
            <div style={{ marginBottom: 12 }}>
              <label style={labelStyle}>Branch</label>
              <select {...register('branch', { required: true })} style={fieldStyle}>
                {BRANCHES.map(b => <option key={b}>{b}</option>)}
              </select>
            </div>
          </div>

          {/* Placement Info */}
          <div className="card">
            <div style={{ fontWeight: 700, marginBottom: 12, color: '#1F4E79' }}>Placement Information</div>
            {[
              { name: 'company_name', label: 'Company Name', placeholder: 'e.g. Google' },
              { name: 'job_role', label: 'Job Role', placeholder: 'e.g. SDE' },
              { name: 'package_lpa', label: 'Package (LPA)', placeholder: '12.5', type: 'number', step: '0.1' },
              { name: 'placement_date', label: 'Placement Date', type: 'date' },
            ].map(f => (
              <div key={f.name} style={{ marginBottom: 12 }}>
                <label style={labelStyle}>{f.label}</label>
                <input type={f.type || 'text'} step={f.step} placeholder={f.placeholder}
                  {...register(f.name, { required: true })}
                  style={{ ...fieldStyle, borderColor: errors[f.name] ? '#dc2626' : '#d1d5db' }}
                />
              </div>
            ))}
            <div style={{ marginBottom: 12 }}>
              <label style={labelStyle}>Sector</label>
              <select {...register('sector')} style={fieldStyle}>
                {SECTORS.map(s => <option key={s}>{s}</option>)}
              </select>
            </div>
            <div style={{ marginBottom: 12 }}>
              <label style={labelStyle}>Company Type</label>
              <select {...register('company_type')} style={fieldStyle}>
                {COMPANY_TYPES.map(t => <option key={t}>{t}</option>)}
              </select>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div>
                <label style={labelStyle}>Offer Type</label>
                <select {...register('offer_type')} style={fieldStyle}>
                  {['Full-Time', 'Intern', 'PPO'].map(o => <option key={o}>{o}</option>)}
                </select>
              </div>
              <div>
                <label style={labelStyle}>Status</label>
                <select {...register('status')} style={fieldStyle}>
                  {['Placed', 'Unplaced', 'Offer-Withdrawn'].map(s => <option key={s}>{s}</option>)}
                </select>
              </div>
            </div>
          </div>
        </div>

        <button type="submit" className="btn-primary" style={{ padding: '10px 32px', fontSize: 14 }}>
          💾 Save Record
        </button>

        {success && <div style={{ marginTop: 14, color: '#16a34a', fontWeight: 500 }}>{success}</div>}
        {error && <div style={{ marginTop: 14, color: '#dc2626', fontWeight: 500 }}>⚠️ {error}</div>}
      </form>
    </div>
  )
}
