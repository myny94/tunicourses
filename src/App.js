import React from 'react';
import './App.css';

import { ReactComponent as Logo } from './graduation-cap.svg'

function periodToString(x) {
  if (x === '5') {
    return 'Kesä'
  } else {
    return x
  }
}

function languageString(x) {
  if (x === 'fi') {
    return 'Finnish'
  }
  else {
    return 'English'
  }
}

function Course(props) {
  const course = props.course
  return (
    <tr>
      <td><a href={course.course_link} target="_blank" rel="noopener noreferrer">{course.course_code}</a></td>
      <td>{course.course_name}</td>
      <td>{course.implementation_year}</td>
      <td>{course.credits}</td>
      <td>{course.periods.map(periodToString).join(" - ")}</td>
      <td>{course.subject}</td>
      <td>{languageString(course.language)}</td>
    </tr>
  )
}

function Checkbox(props) {
  return (
    <label className="checkbox-label">
      <span className="checkbox">
        <input
          type="checkbox"
          checked={props.checked}
          onChange={event => props.setChecked(event.target.checked)}
        />
        <span className="checkbox-custom"></span>
      </span>
      {props.label}
    </label>
  )
}

function PeriodCheckbox(props) {
  // label, period, periods, setPeriods
  return (
    <Checkbox label={props.label} checked={props.periods.includes(props.period)} setChecked={checked => {
      if (checked) {
        props.setPeriods([...props.periods, props.period])
      } else {
        props.setPeriods([...props.periods].filter(x => x !== props.period))
      }
    }} />
  )
}

function LanguageCheckbox(props) {
  return (
    <label>
      <Checkbox label={props.label} checked={props.languages.includes(props.language)} setChecked={checked => {
        if (checked) {
          props.setLanguages([...props.languages, props.language])
        }
        else {
          props.setLanguages([...props.languages].filter(x => x !== props.language))
        }
      }} />
    </label> 
  )
}

const allSubjectsOption = 'All subjects'

function App() {
  const [searchTerm, setSearchTerm] = React.useState('')
  const [courses, setCourses] = React.useState([])
  const [periods, setPeriods] = React.useState([])
  const [subject, setSubject] = React.useState(allSubjectsOption)
  const [languages, setLanguages] = React.useState([])

  React.useEffect(() => {
    fetch('/courses.json')
      .then(data => data.json())
      .then(data => setCourses(data))
  }, [])

  console.log('searchTerm = ', searchTerm)
  console.log('periods = ', periods)
  console.log('languages =', languages)
  console.log('subject =', subject)
  const filteredCourses = courses
    .filter(course => 
      (course.course_code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.course_name.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (periods.length === 0 || course.periods.filter(value => periods.includes(value)).length > 0) &&
      (languages.length === 0 || languages.includes(course.language)) &&
      (subject === allSubjectsOption || subject === course.subject)
    )

  const unique_subjects = [allSubjectsOption, ...new Set(courses.map(item => item.subject))]
  return (
    <div className="App">
      <div className="header">
        <Logo className="logo" /> TUNI course search (Hervanta Campus)  
      </div>
      <i className="fas fa-user"></i>
        <input type="text" placeholder="Type course code or course name here" className="input" onChange={event => setSearchTerm(event.target.value)} />
        <div className="periodCheckbox">
          <span className="text">Periods</span>
          {
            ["1", "2", "3", "4", "5"].map(period => (
              <PeriodCheckbox key={period} label={periodToString(period)} period={period} periods={periods} setPeriods={setPeriods} />
            ))
          }
        </div>
        <div className="subjectDropbox">
        <span className="text">Subject</span>
          <select value={subject} onChange={event => setSubject(event.target.value)}>
            {unique_subjects.map(subject => <option key={subject} value={subject}>{subject}</option>)}
          </select>  
        </div>
        
        <div className="languageCheckbox">
        <span className="text">Language</span>
          {
            ["en","fi"].map(language => (
              <LanguageCheckbox key={language} label={languageString(language)} languages={languages} language={language} setLanguages={setLanguages}/>
            ))
          }
        </div>
        <table className="courses">
          <thead>
          <tr>
            <th>Course code</th>
            <th>Course name</th>
            <th>Implementation year</th>
            <th>Credits(cr)</th>
            <th>Periods</th>
            <th>Subject</th>
            <th>Language</th>
          </tr>
          </thead>
          <tbody>
          {filteredCourses.map(course => (
            <Course key={course.course_code} course={course} />
          ))}
          </tbody>
        </table>
    </div>
  );
}

export default App;
