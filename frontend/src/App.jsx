import './App.css'
import React, { useState, useRef, useEffect } from 'react'
import TextInput from './components/TextInput.jsx'
import TextareaInput from './components/TextareaInput.jsx'
import Dropdown from './components/DropdownInput.jsx'
import RadioInput from './components/RadioInput.jsx'
import Credits from './components/Credits.jsx'
import TopicsJSON from './data/topics.json'

import he from 'he'

function App() {  
  // init form data
  const [formType, setFormType] = useState("")

  const [triviaFormData, setTriviaFormData] = useState({    
    category: 9,
    difficulty: 'easy',
    type:'multiple'
  })

  const [topicFormData, setTopicFormData] = useState({    
    category: 'conversation',
    singleWord: "false"
  })
  
  const [question, setQuestion] = useState("")
  const [answer, setAnswer] = useState("")
  const [answerVisible, setAnswerVisible] = useState(false)

  // handle inputs trivia
  const handleInputChangeTrivia = (e) => {
    const { name, value, type, files } = e.target;
    setTriviaFormData(prevData => ({
        ...prevData,
        [name]: (type === 'file') ? files[0] : value
      })
    );
  }
  
  // handle inputs topic topic
  const handleInputChangeTopic = (e) => {
    const { name, value, type, files } = e.target;
    setTopicFormData(prevData => ({
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
  const handleRandomTrivia = async (e) => {
    e.preventDefault();
    console.log('Form submitted:', triviaFormData);    

    const amount = 1;
    const url = `https://opentdb.com/api.php?amount=${amount}&category=${encodeURIComponent(triviaFormData.category)}&difficulty=${encodeURIComponent(triviaFormData.difficulty)}&type=${encodeURIComponent(triviaFormData.type)}`;
    console.log(url);

    try {
      const res = await fetch(url);
      
      // Check for HTTP errors (like 429 Too Many Requests)
      if (res.status === 429) {
        const rateLimitErr = new Error("Too many requests");
        rateLimitErr.code = "TOO_MANY_REQUESTS"; // Assigning custom code
        throw rateLimitErr;
      }

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const response = await res.json();

      // OpenTDB specific API response codes (0 = Success, 5 = Rate Limit)
      if (response.response_code === 5) {
        const rateLimitErr = new Error("Too many requests");
        rateLimitErr.code = "TOO_MANY_REQUESTS";
        throw rateLimitErr;
      }

      // Ensure we actually have results before processing
      if (!response.results || response.results.length === 0) {
        throw new Error("No results found.");
      }

      const questionData = response.results[0];
      
      // Handle "multiple" choice questions
      if (triviaFormData.type === "multiple") {
        let answers = ["- " + questionData.correct_answer];
        
        for (let i = 0; i < questionData.incorrect_answers.length; i++) {
          answers.push("- " + questionData.incorrect_answers[i]);
        }      

        // Shuffle answers
        answers = answers.sort(() => Math.random() - 0.5);
        setQuestion(unescapeHTML(questionData.question + "\n\n" + answers.join("\n")));      
      } else {
        // Handle "boolean" (True/False) questions
        setQuestion(unescapeHTML(questionData.question));
      }            
      
      // Set Answer
      setAnswer(unescapeHTML(questionData.correct_answer));
      setAnswerVisible(false);

    } catch (err) {
      console.error(err);
      
      // Safely check for our custom error code
      if (err.code === "TOO_MANY_REQUESTS") {
        setQuestion("Error: too many requests. Please try again shortly.");
      } else {
        // Generic fallback for network failures, parsing errors, etc.
        setQuestion("An error occurred while fetching the trivia question.");
      }
      
      setAnswer("");
      setAnswerVisible(false);
    }
  };

  // generate random topic
  const handleRandomTopic = (e) => {
    e.preventDefault();
    console.log('Form submitted:', topicFormData);

    // format url
    const amount = 1        

    // get filtered data
    try{
      const filteredTopics = TopicsJSON.filter((elm, arr)=>{      
        const matchesCategory = topicFormData.category === "all" || elm.tags.includes(topicFormData.category);          
        let matchesSingleWord = true; 
        if (topicFormData.singleWord === "true") {        
          matchesSingleWord = elm.tags.includes("single");
        } 
        
        return matchesCategory && matchesSingleWord;
      })                                  


      // output
      console.log(filteredTopics)    
      const index = Math.floor(Math.random() * filteredTopics.length)
      console.log(index)
      setQuestion(filteredTopics[index].name)   
    }catch(err){
      // output        
      console.log(err)
      setQuestion("No relevant question was found")   
    }     
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
                <h3>Question Category:</h3>
                <RadioInput 
                    name="radioFormType"
                    selectedValue={formType}
                    onChange={(e) => setFormType(e.target.value)}
                    options={[
                        { label: 'Random Topic', value: 'topic' },
                        { label: 'Random Trivia', value: 'trivia' }
                    ]}
                />
              </div>
            </div>   

            {/* Topic form */}
            { formType == "topic" && 
              <div className="flex-row">

                <div className="flex-col">
                  <label>Single word</label>
                  <RadioInput 
                      name="singleWord"
                      selectedValue={topicFormData.singleWord}
                      onChange={handleInputChangeTopic}
                      options={[
                          { label: 'Yes', value: "true" },
                          { label: 'No', value: "false"}
                      ]}
                  />
                </div>

                <div className="flex-col">
                  {/* category */}
                  <Dropdown
                  name="category" 
                  value={topicFormData.category} 
                  onChange={handleInputChangeTopic} 
                  options={[                        
                          //{value:"Any Category", label:"Any Category"},                                                                              
                          {value:"all", label:"Surprise Me (All)"},
                          {value:"writing", label:"Story Starters"},
                          {value:"conversation", label:"Ice Breakers"},
                          {value:"creative", label:"Muse Moments"},
                          {value:"fun", label:"Just for Laughs"},
                          {value:"school", label:"Debate Club"},
                          {value:"philosophy", label:"Deep Dive"},
                          {value:"tech", label:"Tech Talk"},
                          {value:"pop", label:"Pop Pulse"},
                          {value:"self", label:"Mirror Mirror"},
                          {value:"single", label:"Word Bank"},
                          ] }                

                  ></Dropdown>
                </div>

                
              </div>            
            }
            {formType == "topic" && <button type="button" className="btn-submit" onClick={handleRandomTopic}>Generate Question</button>}

            
            {/* Trivia form */}
            {formType == "trivia" &&
              <div className="flex-row">

                <div className="flex-col">
                  {/* category */}
                  <Dropdown
                  name="category" 
                  value={triviaFormData.category} 
                  onChange={handleInputChangeTrivia} 
                  options={[                        
                          //{value:"Any Category", label:"Any Category"},
                          {value:9, label:"General Knowledge"},
                          {value:10, label:"Entertainment: Books"},
                          {value:11, label:"Entertainment: Film"},
                          {value:12, label:"Entertainment: Music"},
                          {value:13, label:"Entertainment: Musicals & Theatres"},
                          {value:14, label:"Entertainment: Television"},
                          {value:15, label:"Entertainment: Video Games"},
                          {value:16, label:"Entertainment: Board Games"},
                          {value:17, label:"Science & Nature"},
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
                          {value:31, label:"Entertainment: Japanese Anime & Manga"},
                          {value:32, label:"Entertainment: Cartoon & Animations"}
                          ] }                
                  ></Dropdown>
                </div>
                
                <div className="flex-col">
                  {/* difficulty */}
                  <Dropdown
                  name="difficulty" 
                  value={triviaFormData.difficulty} 
                  onChange={handleInputChangeTrivia} 
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
                  onChange={handleInputChangeTrivia} 
                  options={[                        
                          //{value:"Any Type", label:"Any Type"},
                          {value:"multiple", label:"Multiple Choice"},
                          {value:"boolean", label:"True/False"}                        
                          ] }
                  placeholder="Type"
                  ></Dropdown>
                </div>
                            
              </div>              
            }            
            {formType == "trivia" && <button type="button" className="btn-submit" onClick={handleRandomTrivia}>Generate Question</button>}
          </form> 
        </div>        

        <div className="card">
          <TextareaInput name="question" id="question" disabled value={question} rows="6"></TextareaInput>
          { formType == "trivia" && <button type="button" className="btn-view-answer" onClick={handleViewAnswer} >View Answer</button>}
          { (formType == "trivia" && answerVisible) && <TextareaInput name="answer" id="answer" disabled={true} value={answer}  onChange={(e) => {setAnswer(e.target.value)}} ></TextareaInput>}
        </div>

      </div>      
      
      <Credits></Credits>
      
    </>
  )
}

export default App
