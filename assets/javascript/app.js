//Main object for the whole game
var triviaGame = {
	current: 0,
	domUserGuess: document.getElementById('user-guess'),
	domScores: document.getElementById("scores"),
	proceed: true,
	countCorrect: 0,
	countIncorrect: 0,
	countUnanswered: 0,
	timer: 7,
	timeToShow: 4000,

	//Array holding separate objects for the game questions and answers
	qAndA : [

		{
			question: "What legendary band gave their last full concert at Candlestick Park on August 29, 1966?",
			answer: "3. The Beatles",
			choices: ["1. Pink Floyd", "2. Led Zeppelin", "3. The Beatles", "4. Justin Bieber"],
			image: "beatles.gif",
			imageIncorrect: "palm-face.gif"

		}, 
		{
			question: "What is the official flower of San Francisco?",
			answer: "3. Dahlia",
			choices: ["1. Monkey Face Orchid", "2. Rose", "3. Dahlia", "4. Dancing Girls"],
			image: "dahlia.gif",
			imageIncorrect: "palm-face.gif"
		},
		
		{
			question: "When Al Capone was held at Alcatraz, he gave regular Sunday concerts with the inmate band, the Rock Islanders. What instrument did he play?",
			answer: "3. Banjo",
			choices: ["1. The 12 Neck Guitar", "2. The Chapman Stick", "3. Banjo", "4. Hydraulophone"],
			image: "banjo.gif",
			imageIncorrect: "palm-face.gif"

		},

		{
			question: "The Band played their last concert ever at Winterland on November 25, 1976. But two years later another legendary band played their last show at the ex-SF ice rink. Which was it?",
			answer: "2. Sex Pistols",
			choices: ["1. Weird Pistols", "2. Sex Pistols", "3. Funny Pistols", "4. Violent Pistols"],
			image: "sex-pistols.gif",
			imageIncorrect: "palm-face.gif"

		},

		{
			question: "Which James Bond movie was set in San Francisco?",
			answer: "1. A View to a Kill",
			choices: ["1. A View to a Kill", "2. Casino Royale", "3. To Kill the Mockingbird", "4. Diamonds are Forever"],
			image: "view-to-kill.gif",
			imageIncorrect: "palm-face.gif"

		},

		{
			question: "The Giants played their last game at Candlestick on Sept. 30, 1999. Did they win or lose?",
			answer: "3. They lost!",
			choices: ["1. They won!", "2. Who are the Giants?", "3. They lost!", "4. It was a tie."],
			image: "crying.gif",
			imageIncorrect: "palm-face.gif"

		},
		{
			question: "What is the name of the tower shaped like a fire-hose nozzle that sits at the top of Telegraph Hill?",
			answer: "2. Coit Tower",
			choices: ["1. Tall Tower", "2. Coit Tower", "3. San Francisco Tower", "4. Fire-Hose Tower"],
			image: "happy.gif",
			imageIncorrect: "palm-face.gif"

		},  
	],
	
	//Method for resetting questions; this.current is counter for the questions the player is on. 
	//Proceed is for mornitoring the timer (whether it should proceed or not)  		
	resetQuestion: function() {
		this.current++;	
		this.domUserGuess.innerHTML = "";
		this.proceed = true;
		this.play();	
	},

	//Method for restarting the game when the questions are over
	restart: function(){
		this.countCorrect = 0;
		this.countIncorrect = 0;
		this.countUnanswered = 0;
		this.current = 0;
		this.domScores.style.display = "none";
		this.domScores.innerHTML = "";
		this.domUserGuess.innerHTML = "";
		this.proceed = true;
		this.play();
	},

	//Method for starting the game. self = this is for  object reference inside the jQuery method
	init: function() {
		var self = this;
		$("#button").on("click", function() {			
			document.getElementById("time-remaining").innerHTML = "Time Remaining";
			$("#button").hide();
			self.play();
		});
	},

	//Method for the actual game; it displays the 1st questions; goes through a loop to determine the current choices for the questions
	play: function(){
		this.stopWatch(this.timer);
		document.getElementById("question").innerHTML = this.qAndA[this.current].question;
			var domChoices = document.getElementById("answers-area");
			var choices = this.qAndA[this.current].choices;
			var html = "<ul id='selections'>";
			for (var i = 0; i < choices.length; i++) {
				choices[i];
				html+= "<li id='choices"+i+"'>"+choices[i]+"</li>";
			}
			html += `</ul>`;
			domChoices.innerHTML = html;
			this.assignAnswerClicks();
	},

	//Methods for varios timers (time remaining, timer for transitional moments) 
	stopWatch: function(count) {
		//A shorthand (a ternary operator) for an if/else statement
		var timeOut = (count == this.timer) ? 0 : 1000;
		setTimeout(() => {
			document.getElementById("time-remaining").innerHTML = `Time Remaining: ${count}`;
				if(count === 0){
					this.htmlUnanswered();
					this.countUnanswered++;
					//The line below checks whether the game is done
					if(this.qAndA.length === this.current+1 ){
						this.scores();
					} else {
						// Using fat arrow to reference the object (this)
						setTimeout(()=>{
							this.resetQuestion();
						},this.timeToShow);
					}
				}
				else if (count != 0 && this.proceed === true) {
				count--;
				this.stopWatch(count);
			}
		}, timeOut);
	},

	//This methos assigns a click for each possible choice
	assignAnswerClicks: function(){
		//We get choice array from the qAndA array of objects
		//We are keeping track of the current index to access the proper object
		var choices = this.qAndA[this.current].choices;
		//Loop for going through all the choices, getting a DOM reference to each choice, and adding a click event to each of those DOM elements
		for(var i=0; i < choices.length; i++){
			// Using let instead of var here; otherwise the onclick event would be always the same
			let id = 'choices'+i;
			let choice = choices[i];
			let element = document.getElementById(id);
			// Using anonymous fat arrow function to preserve the correct refernce to the object
			element.onclick = ()=>{
				this.selectAnswer(choice);
			}		
		}
	},
	// This method recives the onclick event from the method above along with the choice argument
	selectAnswer: function(choice) {
		this.proceed = false;
		if(choice === this.qAndA[this.current].answer){
			this.countCorrect++;
			this.htmlCorrect();
		}
		else{
			this.countIncorrect++;
			this.htmlIncorrect();
		}
		if(this.qAndA.length != this.current+1 ){
			setTimeout( ()=>{
				this.resetQuestion();
			}, this.timeToShow);
		} else {
			this.scores();
		}
	},

	// Below methods are for placing responses to user's input (correct, incorrect, unanswered)
	htmlCorrect: function(){
		this.domUserGuess.innerHTML = "<div class='w-300'>Correct!</div>"+
									  "<div><img src='assets/images/"+this.qAndA[this.current].image+"' /></div>";
	},
	htmlIncorrect: function(){
		this.domUserGuess.innerHTML = "<div class='w-300'>Incorrect, the correct answer was: "+this.qAndA[this.current].answer+"</div>"+
									  "<div><img src='assets/images/"+this.qAndA[this.current].imageIncorrect+"' /></div>";	
	}, 

	htmlUnanswered: function(){
		this.domUserGuess.innerHTML = "<div>No answer...the correct answer was: "+this.qAndA[this.current].answer+"</div>"+
									  "<div><img src='assets/images/"+this.qAndA[this.current].imageIncorrect+"' /></div>";	
	},

	// Method for capturing user's answers and displaying them in html
	scores: function() {
		setTimeout( ()=>{
				document.getElementById('question').innerHTML = "";
				document.getElementById('answers-area').innerHTML = "";	
				document.getElementById('user-guess').innerHTML = "";
				document.getElementById('time-remaining').innerHTML = "";			
				this.domScores.style.display = "block";
				this.domScores.innerHTML = "<div class='correct-answers-area'>Correct answers: " + this.countCorrect + "</div>"+
										"<div class='incorrect-answers-area'>Incorrect answers: " + this.countIncorrect + "</div>"+
										"<div class='unanswered-questions-area'>Unanswered questions: " + this.countUnanswered + "</div>"+
										"<div><button id='restart-button' class='button'>Restart!</button></div>";
				document.getElementById('restart-button').onclick = ()=>{
					this.restart();
				}
				//This method is for trigeering the timer in between the answered question and the new question 
			}, this.timeToShow);		
	},
}

//Creating an instance of the main object in order to be able to use all of the object's properties and methods
var trivia = Object.create(triviaGame);

//Calling the init method to start the game
trivia.init();
