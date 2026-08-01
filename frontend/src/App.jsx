import './App.css'
import React, { useState, useRef, useEffect } from 'react'
import TextInput from './components/TextInput.jsx'
import TextareaInput from './components/TextareaInput.jsx'
import Dropdown from './components/DropdownInput.jsx'

import Credits from './components/Credits.jsx'

function App() {  
  // init form data
  const [formData, setFormData] = useState({    
    category: 9,
    difficulty: 'easy',
    type:'multiple'
  })

  const [question, setQuestion] = useState("")
  const [answer, setAnswer] = useState("")
  const [answerVisible, setAnswerVisible] = useState(false)

  // handle inputs
  const handleInputChange = (e) => {
    const { name, value, type, files } = e.target;
    setFormData(prevData => ({
        ...prevData,
        [name]: (type === 'file') ? files[0] : value
      })
    );
  }

  // generate question of the day
  const handleSubmit = async (e) =>{
    e.preventDefault();
    console.log('Form submitted:', formData);

    // format url
    const amount = 1
    const url = `https://opentdb.com/api.php?amount=${amount}&category=${encodeURIComponent(formData.category)}&difficulty=${encodeURIComponent(formData.difficulty)}&type=${encodeURIComponent(formData.type)}`
    console.log(url)

    // get data 
    const response = await (await fetch(url)).json()


    // output
    console.log(response.results)
    setAnswerVisible(false)
    setQuestion(response.results[0].question)
    setAnswer(response.results[0].correct_answer)
    
  }

  // handle view answer
  const handleViewAnswer = (e) =>{
    setAnswerVisible(true)
  }

  return (
    <>      
      <div className="main-container">
        <div className="card">
          <form onSubmit={handleSubmit}> 

            <h1 className="title">Question of the Day!</h1>         

            <div className="flex-row">

              <div className="flex-col">
                {/* category */}
                <Dropdown
                name="category" 
                value={formData.category} 
                onChange={handleInputChange} 
                options={[                        
                        //{value:"Any Category", label:"Any Category"},
                        {value:9, label:"General Knowledge"},
                        {value:10, label:"Entertainment: Books"},
                        {value:11, label:"Entertainment: Film"},
                        {value:12, label:"Entertainment: Music"},
                        {value:13, label:"Entertainment: Musicals &amp; Theatres"},
                        {value:14, label:"Entertainment: Television"},
                        {value:15, label:"Entertainment: Video Games"},
                        {value:16, label:"Entertainment: Board Games"},
                        {value:17, label:"Science &amp; Nature"},
                        {value:18, label:"Science: Computers"},
                        {value:19, label:"Science: Mathematics"},
                        {value:20, label:"Mythology"},
                        {value:21, label:"Sports"},
                        {value:22, label:"Geography"},
                        {value:23, label:"History"},
                        {value:24, label:"Politics"},
                        {value:25, label:"Art"},
                        {value:26, label:"Celebrities"},
                        {value:27, label:"Animals"},
                        {value:28, label:"Vehicles"},
                        {value:29, label:"Entertainment: Comics"},
                        {value:20, label:"Science: Gadgets"},
                        {value:31, label:"Entertainment: Japanese Anime &amp; Manga"},
                        {value:32, label:"Entertainment: Cartoon &amp; Animations"}
                        ] }                
                ></Dropdown>
              </div>
              
              <div className="flex-col">
                {/* difficulty */}
                <Dropdown
                name="difficulty" 
                value={formData.difficulty} 
                onChange={handleInputChange} 
                options={[                        
                        //{value:"Any Difficulty", label:"Any Difficulty"},
                        {value:"easy", label:"Easy"},
                        {value:"medium", label:"Medium"},                        
                        {value:"hard", label:"Hard"}
                        ] }
                placeholder="Difficulty"
                ></Dropdown>
              </div>
              
              <div className="flex-col">
                {/* type */}
                <Dropdown
                name="type" 
                value={formData.type} 
                onChange={handleInputChange} 
                options={[                        
                        //{value:"Any Type", label:"Any Type"},
                        {value:"multiple", label:"Multiple Choice"},
                        {value:"boolean", label:"True/False"}                        
                        ] }
                placeholder="Type"
                ></Dropdown>
              </div>
                          
            </div>
                      
            

            <button type="submit" className="btn-submit">Generate Question</button>
          </form> 
        </div>        

        <div className="card">
          <TextareaInput name="question" id="question" disabled value={question}></TextareaInput>
          <button type="button" className="btn-view-answer" onClick={handleViewAnswer}>View Answer</button>
          { answerVisible && <TextareaInput name="answer" id="answer" disabled={true} value={answer} onChange={(e) => {setAnswer(e.target.value)}}></TextareaInput>}
        </div>

      </div>      
      
      <Credits></Credits>
      
    </>
  )
}

export default App
