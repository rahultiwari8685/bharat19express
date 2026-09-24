import React, { useState, useEffect } from 'react'
import {
  CCard,
  CCardBody,
  CCardHeader,
  CForm,
  CFormInput,
  CFormTextarea,
  CFormSelect,
  CButton,
  CRow,
  CCol,
  CTable,
  CTableBody,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableDataCell,
  COffcanvas,
  COffcanvasHeader,
  COffcanvasBody,
  CPagination,
  CPaginationItem,
} from '@coreui/react'

import { useForm } from 'react-hook-form'
import setting from '../../../setting.json'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import secureLocalStorage from 'react-secure-storage'
import { cilPencil, cilTrash } from '@coreui/icons'
import CIcon from '@coreui/icons-react'

const schema = yup.object().shape({
  title: yup.string().required('Title is required'),
  slug: yup.string().required('Slug is required'),
  description: yup.string(),
  category: yup.string(),
  issueDate: yup.string().required('Issue date is required'),
  featured: yup.string().required('Featured is required'),
  status: yup.string().required('Status is required'),
})

const Magazine = () => {
  const [magazineList, setMagazineList] = useState([])

  const [editingMagazine, setEditingMagazine] = useState(null)
  const [visible, setVisible] = useState(false)

  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  const [coverPreview, setCoverPreview] = useState(null)

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  })

  // ==========================================
  // EDIT DATA LOAD
  // ==========================================

  useEffect(() => {
    if (editingMagazine) {
      reset({
        title: editingMagazine.title || '',
        slug: editingMagazine.slug || '',
        description: editingMagazine.description || '',
        category: editingMagazine.category || '',
        issueDate: editingMagazine.issueDate
          ? new Date(editingMagazine.issueDate).toISOString().split('T')[0]
          : '',
        featured: editingMagazine.featured ? '1' : '0',
        status: editingMagazine.status ? '1' : '0',
      })

      if (editingMagazine.coverImage) {
        setCoverPreview(`${setting.api}/uploads/magazines/${editingMagazine.coverImage}`)
      } else {
        setCoverPreview(null)
      }
    }
  }, [editingMagazine, reset])

  // ==========================================
  // GET ALL MAGAZINES
  // ==========================================

  const allMagazineList = async () => {
    try {
      await fetch(setting.api + '/api/magazines', {
        method: 'GET',
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + JSON.parse(secureLocalStorage.getItem('logininfo')).token,
        },
      })
        .then((response) => response.json())
        .then((result) => {
          if (result.status === false) {
            console.log('Magazine API Error:', result.message)
          } else if (result.success === false) {
            console.log('Magazine API Error:', result.message)
          } else {
            setMagazineList(result.data || [])
          }
        })
    } catch (error) {
      console.error('Error loading magazines:', error)
    }
  }

  useEffect(() => {
    allMagazineList()
  }, [])

  // ==========================================
  // GENERATE SLUG
  // ==========================================

  const generateSlug = (value) => {
    return value
      .toString()
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/--+/g, '-')
  }

  const handleTitleChange = (e) => {
    const value = e.target.value

    setValue('title', value)

    if (!editingMagazine) {
      setValue('slug', generateSlug(value))
    }
  }

  // ==========================================
  // COVER PREVIEW
  // ==========================================

  const handleCoverChange = (e) => {
    const file = e.target.files?.[0]

    if (file) {
      setCoverPreview(URL.createObjectURL(file))
    }
  }

  // ==========================================
  // SAVE / UPDATE MAGAZINE
  // ==========================================

  const saveMagazine = async (data) => {
    const formData = new FormData()

    formData.append('title', data.title)
    formData.append('slug', data.slug)
    formData.append('description', data.description || '')
    formData.append('category', data.category || '')
    formData.append('issueDate', data.issueDate)
    formData.append('featured', data.featured)
    formData.append('status', data.status)

    // Cover Image
    if (data.coverImage?.[0]) {
      formData.append('coverImage', data.coverImage[0])
    }

    // PDF
    if (data.pdfFile?.[0]) {
      formData.append('pdfFile', data.pdfFile[0])
    }

    let endpoint = '/api/magazines'
    let method = 'POST'

    let headers = {
      Authorization: 'Bearer ' + JSON.parse(secureLocalStorage.getItem('logininfo')).token,
    }

    // ==========================================
    // UPDATE
    // ==========================================

    if (editingMagazine) {
      endpoint = `/api/magazines/${editingMagazine._id}`
      method = 'PUT'
    }

    try {
      const res = await fetch(setting.api + endpoint, {
        method,
        body: formData,
        mode: 'cors',
        headers,
      })

      const result = await res.json()

      console.log('Magazine API response:', result)

      if (result.success === true || result.status === true) {
        allMagazineList()

        reset()

        setEditingMagazine(null)

        setVisible(false)

        setCoverPreview(null)
      } else {
        alert(result.message || 'Failed to save magazine')
      }
    } catch (error) {
      console.error('Error saving magazine:', error)
    }
  }

  // ==========================================
  // EDIT
  // ==========================================

  const handleEdit = (magazine) => {
    setEditingMagazine(magazine)
    setVisible(true)
  }

  // ==========================================
  // DELETE CONFIRMATION
  // ==========================================

  function handleDelete(id) {
    var ans = confirm('Are you sure For Delete?')

    console.log(ans)

    if (ans === true) {
      deleteMagazine(id)
    }
  }

  // ==========================================
  // DELETE MAGAZINE
  // ==========================================

  const deleteMagazine = async (id) => {
    try {
      const loginInfo = JSON.parse(secureLocalStorage.getItem('logininfo') || '{}')

      const token = loginInfo?.token || ''

      const response = await fetch(`${setting.api}/api/magazines/${id}`, {
        method: 'DELETE',
        mode: 'cors',
        headers: {
          Authorization: 'Bearer ' + token,
          'Content-Type': 'application/json',
        },
      })

      const result = await response.json()

      if (!response.ok) {
        console.error('Delete failed:', result)
      } else {
        console.log('Magazine deleted:', result)

        allMagazineList()
      }
    } catch (err) {
      console.error('Error deleting magazine:', err)
    }
  }

  // ==========================================
  // PAGINATION
  // ==========================================

  const totalPages = Math.ceil(magazineList.length / itemsPerPage)

  const paginatedItems = magazineList.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  )

  // ==========================================
  // RETURN
  // ==========================================

  return (
    <div>
      <CCard className="shadow border-0 rounded-4">
        <CCardHeader className="bg-dark text-white fw-bold px-4 py-3 shadow-sm">
          <div className="d-flex justify-content-between align-items-center">
            <h5 className="mb-0">
              <i className="bi bi-newspaper me-2 text-warning"></i>
              Magazine / E-Paper
            </h5>

            <CButton
              color="light"
              variant="outline"
              className="fw-semibold px-3 shadow-sm rounded-pill"
              onClick={() => {
                setEditingMagazine(null)
                reset({
                  title: '',
                  slug: '',
                  description: '',
                  category: '',
                  issueDate: '',
                  featured: '0',
                  status: '1',
                })
                setCoverPreview(null)
                setVisible(true)
              }}
            >
              <i className="bi bi-plus-circle me-2"></i>
              Create Magazine
            </CButton>
          </div>
        </CCardHeader>

        <CCardBody>
          <CTable striped responsive bordered hover>
            <CTableHead color="dark">
              <CTableRow>
                <CTableHeaderCell>#</CTableHeaderCell>

                <CTableHeaderCell>Cover</CTableHeaderCell>

                <CTableHeaderCell>Title</CTableHeaderCell>

                <CTableHeaderCell>Category</CTableHeaderCell>

                <CTableHeaderCell>Issue Date</CTableHeaderCell>

                <CTableHeaderCell>Featured</CTableHeaderCell>

                <CTableHeaderCell>Status</CTableHeaderCell>

                <CTableHeaderCell>Action</CTableHeaderCell>
              </CTableRow>
            </CTableHead>

            <CTableBody>
              {paginatedItems.map((magazine, index) => {
                const actualIndex = (currentPage - 1) * itemsPerPage + index

                return (
                  <CTableRow key={magazine._id}>
                    <CTableDataCell>{actualIndex + 1}</CTableDataCell>

                    {/* COVER */}

                    <CTableDataCell>
                      {magazine.coverImage ? (
                        <img
                          src={`${setting.api}/uploads/magazines/${magazine.coverImage}`}
                          alt={magazine.title}
                          style={{
                            width: '60px',
                            height: '75px',
                            objectFit: 'cover',
                            borderRadius: '5px',
                          }}
                        />
                      ) : (
                        <span className="text-muted">No Cover</span>
                      )}
                    </CTableDataCell>

                    {/* TITLE */}

                    <CTableDataCell>
                      <strong>{magazine.title}</strong>

                      <div className="small text-muted">{magazine.slug}</div>
                    </CTableDataCell>

                    {/* CATEGORY */}

                    <CTableDataCell>{magazine.category || '-'}</CTableDataCell>

                    {/* ISSUE DATE */}

                    <CTableDataCell>
                      {magazine.issueDate
                        ? new Date(magazine.issueDate).toLocaleDateString('en-IN')
                        : '-'}
                    </CTableDataCell>

                    {/* FEATURED */}

                    <CTableDataCell>
                      <span
                        className={`badge ${
                          magazine.featured ? 'bg-warning text-dark' : 'bg-secondary'
                        }`}
                      >
                        {magazine.featured ? 'Featured' : 'No'}
                      </span>
                    </CTableDataCell>

                    {/* STATUS */}

                    <CTableDataCell>
                      <span className={`badge ${magazine.status ? 'bg-success' : 'bg-dark'}`}>
                        {magazine.status ? 'Published' : 'Inactive'}
                      </span>
                    </CTableDataCell>

                    {/* ACTION */}

                    <CTableDataCell>
                      <CButton
                        size="sm"
                        color="warning"
                        className="rounded-pill px-3 shadow-sm fw-semibold"
                        onClick={() => handleEdit(magazine)}
                      >
                        <CIcon
                          icon={cilPencil}
                          style={{
                            marginRight: '5px',
                          }}
                        />
                        Edit
                      </CButton>{' '}
                      <CButton
                        size="sm"
                        color="danger"
                        className="rounded-pill px-3 shadow-sm fw-semibold"
                        onClick={() => handleDelete(magazine._id)}
                      >
                        <CIcon
                          icon={cilTrash}
                          style={{
                            marginRight: '5px',
                          }}
                        />
                        Delete
                      </CButton>
                    </CTableDataCell>
                  </CTableRow>
                )
              })}
            </CTableBody>
          </CTable>

          {/* PAGINATION */}

          {totalPages > 0 && (
            <div className="d-flex justify-content-end mt-3">
              <CPagination align="end">
                {[...Array(totalPages)].map((_, idx) => (
                  <CPaginationItem
                    key={idx + 1}
                    active={currentPage === idx + 1}
                    onClick={() => setCurrentPage(idx + 1)}
                  >
                    {idx + 1}
                  </CPaginationItem>
                ))}
              </CPagination>
            </div>
          )}
        </CCardBody>
      </CCard>

      {/* ==========================================
          CREATE / EDIT OFFCANVAS
      ========================================== */}

      <COffcanvas
        placement="end"
        visible={visible}
        onHide={() => setVisible(false)}
        backdrop={true}
        style={{
          width: '500px',
        }}
      >
        <COffcanvasHeader className="bg-dark text-white fw-bold" closeButton>
          {editingMagazine ? 'Update Magazine' : 'Create Magazine'}
        </COffcanvasHeader>

        <COffcanvasBody>
          <CForm onSubmit={handleSubmit(saveMagazine)}>
            {/* TITLE */}

            <CRow className="mb-3">
              <CCol md={12}>
                <CFormInput
                  type="text"
                  placeholder="Enter Magazine / Newspaper Title"
                  label="Title"
                  {...register('title')}
                  onChange={handleTitleChange}
                />

                {errors.title && <small className="text-danger">{errors.title.message}</small>}
              </CCol>
            </CRow>

            {/* SLUG */}

            <CRow className="mb-3">
              <CCol md={12}>
                <CFormInput
                  type="text"
                  placeholder="magazine-title"
                  label="Slug"
                  {...register('slug')}
                />

                {errors.slug && <small className="text-danger">{errors.slug.message}</small>}
              </CCol>
            </CRow>

            {/* CATEGORY + ISSUE DATE */}

            <CRow className="mb-3">
              <CCol md={6}>
                <CFormInput
                  type="text"
                  label="Category"
                  placeholder="Newspaper"
                  {...register('category')}
                />
              </CCol>

              <CCol md={6}>
                <CFormInput type="date" label="Issue Date" {...register('issueDate')} />

                {errors.issueDate && (
                  <small className="text-danger">{errors.issueDate.message}</small>
                )}
              </CCol>
            </CRow>

            {/* DESCRIPTION */}

            <CRow className="mb-3">
              <CCol md={12}>
                <CFormTextarea
                  rows={4}
                  label="Description"
                  placeholder="Enter description"
                  {...register('description')}
                />
              </CCol>
            </CRow>

            {/* COVER */}

            <CRow className="mb-3">
              <CCol md={12}>
                <CFormInput
                  type="file"
                  label="Cover Image"
                  accept="image/*"
                  {...register('coverImage')}
                  onChange={handleCoverChange}
                />

                {coverPreview && (
                  <div className="mt-3">
                    <img
                      src={coverPreview}
                      alt="Cover Preview"
                      style={{
                        width: '100px',
                        height: '130px',
                        objectFit: 'cover',
                        borderRadius: '6px',
                        border: '1px solid #ddd',
                      }}
                    />
                  </div>
                )}
              </CCol>
            </CRow>

            {/* PDF */}

            <CRow className="mb-3">
              <CCol md={12}>
                <CFormInput
                  type="file"
                  label={editingMagazine ? 'Replace E-Paper PDF' : 'E-Paper / Newspaper PDF'}
                  accept="application/pdf"
                  {...register('pdfFile')}
                />

                {editingMagazine?.pdfFile && (
                  <div className="mt-2">
                    <a
                      href={`${setting.api}/uploads/magazines/${editingMagazine.pdfFile}`}
                      target="_blank"
                      rel="noreferrer"
                    >
                      View Current PDF
                    </a>
                  </div>
                )}

                {!editingMagazine && (
                  <small className="text-muted">Upload complete newspaper / magazine PDF.</small>
                )}
              </CCol>
            </CRow>

            {/* FEATURED + STATUS */}

            <CRow className="mb-3">
              <CCol md={6}>
                <CFormSelect label="Featured" {...register('featured')}>
                  <option value="">Select</option>
                  <option value="1">Yes</option>
                  <option value="0">No</option>
                </CFormSelect>

                {errors.featured && (
                  <small className="text-danger">{errors.featured.message}</small>
                )}
              </CCol>

              <CCol md={6}>
                <CFormSelect label="Status" {...register('status')}>
                  <option value="">Select Status</option>
                  <option value="1">Published</option>
                  <option value="0">Inactive</option>
                </CFormSelect>

                {errors.status && <small className="text-danger">{errors.status.message}</small>}
              </CCol>
            </CRow>

            {/* SAVE */}

            <div className="d-flex justify-content-end">
              <CButton
                type="submit"
                color={editingMagazine ? 'warning' : 'success'}
                className="rounded-pill px-4 shadow-sm fw-semibold"
              >
                <i
                  className={`bi ${editingMagazine ? 'bi-arrow-repeat' : 'bi-check-circle'} me-2`}
                ></i>

                {editingMagazine ? 'Update Magazine' : 'Save Magazine'}
              </CButton>
            </div>
          </CForm>
        </COffcanvasBody>
      </COffcanvas>
    </div>
  )
}

export default Magazine
