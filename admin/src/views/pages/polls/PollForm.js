import React, { useEffect, useState } from 'react'
import { CForm, CFormInput, CFormCheck, CButton, CRow, CCol } from '@coreui/react'
import axios from 'axios'
import setting from '../../../setting.json'
import secureLocalStorage from 'react-secure-storage'

const PollForm = ({ editPoll, onSuccess }) => {
  const [question, setQuestion] = useState('')
  const [options, setOptions] = useState(['', ''])
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [showResult, setShowResult] = useState(true)

  useEffect(() => {
    if (editPoll) {
      setQuestion(editPoll.question)
      setOptions(editPoll.options.map((o) => o.text))
      setStartDate(editPoll.start_date?.substring(0, 16))
      setEndDate(editPoll.end_date?.substring(0, 16))
      setShowResult(editPoll.show_result)
    }
  }, [editPoll])

  const addOption = () => setOptions([...options, ''])
  const updateOption = (i, val) => {
    const updated = [...options]
    updated[i] = val
    setOptions(updated)
  }
  const removeOption = (i) => setOptions(options.filter((_, index) => index !== i))

  const submitPoll = async (e) => {
    e.preventDefault()

    const token = JSON.parse(secureLocalStorage.getItem('logininfo'))?.token

    const payload = {
      question,
      options: options.map((text) => ({ text })),
      start_date: startDate,
      end_date: endDate,
      show_result: showResult,
    }

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }

    if (editPoll) {
      await axios.put(
        `${setting.api}/api/polls/admin/${editPoll._id}`,
        payload,
        config, // ✅ pass here
      )
    } else {
      await axios.post(
        `${setting.api}/api/polls/savePoll`,
        payload,
        config, // ✅ also here
      )
    }

    onSuccess()
  }

  return (
    <CForm onSubmit={submitPoll}>
      <CRow>
        <CCol md={12} className="mb-3">
          <CFormInput
            label="Poll Question"
            placeholder="Enter Poll Title"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            required
          />
        </CCol>

        <CCol md={12}>
          <label className="fw-bold mb-2">Options</label>

          {options.map((opt, i) => (
            <div key={i} className="d-flex mb-2">
              <CFormInput
                value={opt}
                onChange={(e) => updateOption(i, e.target.value)}
                placeholder={`Option ${i + 1}`}
                required
              />
              {options.length > 2 && (
                <CButton color="danger" size="sm" className="ms-2" onClick={() => removeOption(i)}>
                  ✕
                </CButton>
              )}
            </div>
          ))}

          <CButton color="secondary" size="sm" onClick={addOption}>
            + Add Option
          </CButton>
        </CCol>

        {/* DATES */}
        <CCol md={6} className="mt-3">
          <CFormInput
            type="datetime-local"
            label="Start Date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            required
          />
        </CCol>

        <CCol md={6} className="mt-3">
          <CFormInput
            type="datetime-local"
            label="End Date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            required
          />
        </CCol>

        {/* SHOW RESULT */}
        <CCol md={12} className="mt-3">
          <CFormCheck
            label="Show Result After Vote"
            checked={showResult}
            onChange={(e) => setShowResult(e.target.checked)}
          />
        </CCol>
      </CRow>

      <div className="mt-4">
        <CButton type="submit" color="success">
          {editPoll ? 'Update Poll' : 'Create Poll'}
        </CButton>
      </div>
    </CForm>
  )
}

export default PollForm
