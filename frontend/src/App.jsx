import './App.css'
import React, { useState, useRef, useEffect } from 'react'
import TextInput from './components/TextInput.jsx'
import TextareaInput from './components/TextareaInput.jsx'
import Dropdown from './components/DropdownInput.jsx'
import Credits from './components/Credits.jsx'

import he from 'he'

function App() {  
  // init form data
  const [triviaFormData, setTriviaFormData] = useState({    
    category: 9,
    difficulty: 'easy',
    type:'multiple'
  })

  const [topicFormData, setTopicFormData] = useState({    
    category: 'Ice Breakers',
    singleWord: false
  })

  const [question, setQuestion] = useState("")
  const [answer, setAnswer] = useState("")
  const [answerVisible, setAnswerVisible] = useState(false)

  // handle inputs
  const handleInputChange = (e) => {
    const { name, value, type, files } = e.target;
    setTriviaFormData(prevData => ({
        ...prevData,
        [name]: (type === 'file') ? files[0] : value
      })
    );
  }

  // unescape characters
  function unescapeHTML(str) {
    return he.decode(str)
  }

  // generate trivia question of the day
  const handleRandomTrivia = async (e) =>{
    e.preventDefault();
    console.log('Form submitted:', triviaFormData);    

    // format url
    const amount = 1
    const url = `https://opentdb.com/api.php?amount=${amount}&category=${encodeURIComponent(triviaFormData.category)}&difficulty=${encodeURIComponent(triviaFormData.difficulty)}&type=${encodeURIComponent(triviaFormData.type)}`
    console.log(url)

    // get data 
    const response = await (await fetch(url)).json()


    // results
    console.log(response.results)

    // question
    if(triviaFormData.type == "multiple" && triviaFormData.type != "boolean"){
      let answers = ["- "+response.results[0].correct_answer]
      console.log(answers)

      for(let i=0; i<response.results[0].incorrect_answers.length; i++){
        answers.push("- " + response.results[0].incorrect_answers[i])
      }      

      // shuffle answers
      answers = answers.sort(() => Math.random() - 0.5)
      console.log(answers)

      setQuestion(unescapeHTML(response.results[0].question + "\n\n" + answers.join("\n")))      
    }else{
      console.log(response.results[0].question)
      setQuestion(unescapeHTML(response.results[0].question))
    }            
    
    // answer
    setAnswer(unescapeHTML(response.results[0].correct_answer))
    setAnswerVisible(false)
    
    
  }

  // generate random topic
  const handleRandomTopic = async (e) => {
    e.preventDefault();
    console.log('Form submitted:', topicFormData);

    // format url
    const amount = 1
    const url = `https://codebeautify.org/randomData`
    console.log(url)

    // get data 
    const response = await fetch(url, {
      "headers": {
        "accept": "*/*",
        "accept-language": "en-US,en;q=0.9",
        "content-type": "application/x-www-form-urlencoded",
        "priority": "u=1, i",
        "sec-ch-ua": "\"Not;A=Brand\";v=\"8\", \"Chromium\";v=\"150\", \"Google Chrome\";v=\"150\"",
        "sec-ch-ua-mobile": "?0",
        "sec-ch-ua-platform": "\"Windows\"",
        "sec-fetch-dest": "empty",
        "sec-fetch-mode": "cors",
        "sec-fetch-site": "same-origin"
      },
      "referrer": "https://codebeautify.org/random-topic-generator",
      "body": "type=topic",
      "method": "POST",
      "mode": "cors",
      "credentials": "include"
    })
    const responseData = await response.json()


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
          <form > 

            <h1 className="title">Question of the Day!</h1>         

            <div className="flex-row">

              <div className="flex-col">
                {/* category */}
                <Dropdown
                name="category" 
                value={triviaFormData.category} 
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
                value={triviaFormData.difficulty} 
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
                value={triviaFormData.type} 
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
                      
            

            <button type="button" className="btn-submit" onClick={handleRandomTrivia}>Generate Question</button>
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
