// quiz bot
var retrieveAnswerKey = function(){
	return JSON.parse(localStorage.getItem('answerKey'));
}
var localStorageExists = function(){
	var a_key = retrieveAnswerKey();
	if(typeof a_key !== "undefined" && a_key && a_key.length>0){
		return true;
	} else{
		return false;
	}
}

var answer_key = localStorageExists() ? retrieveAnswerKey() : [];

var wrongAnswer = function(qid, aid){
	for(var i=0; i<answer_key.length; i++){
		var q = answer_key[i];
		if(qid == q.q_id){
			return q.incorrects.indexOf(aid) > -1;
		}
	}
	return false;
};

var qidInAnswerkey = function(qid){
	for(var i=0; i<answer_key.length; i++){
		var q = answer_key[i];
		if(qid == q.q_id){
			return true;
		}
	}
	return false;
};

function runBot(options){ // add 'practice_test': boolean
	$('.display_question').each(function(){
		var question_id = $(this).attr('id').split('_')[1],
			question_text = $(this).find('.question_text').text().trim();
		if(options['first_time'] === true){
			// console.log('FIRST TIME THROUGH');
			var answer_id = $(this).find('.answer_input > input')[0].value;
			$('#question_'+question_id+'_answer_'+answer_id).click().attr('checked','checked');
		} else if(qidInAnswerkey(question_id)){
			// console.log('QUESTION ID IS IN ANSWER KEY');
			for(var i=0; i<answer_key.length; i++){
				if(question_id == answer_key[i].q_id){
					if(answer_key[i].correct){
						// console.log('MARK AS CORRECT');
						$('#question_'+answer_key[i].q_id+'_answer_'+answer_key[i].a_id).click().attr('checked','checked');
					} else{
						// console.log('IN BUT NOT CORRECT FIND ONE THAT WORKS');
						var alreadySelected = false;
						$(this).find('.answer_input > input').each(function(){
							var answer_id = $(this).attr('value');
							if(!wrongAnswer(question_id, answer_id) && !alreadySelected){
								$('#question_'+question_id+'_answer_'+answer_id).click().attr('checked','checked');
								alreadySelected = true;
							}
						});
					}
				}
			}	
		} else if(options['practice_test'] === true){
			console.log('answer this one yourself: it\'s blank');
		} else{
			var answer_id = $(this).find('.answer_input > input')[0].value;
			$('#question_'+question_id+'_answer_'+answer_id).click().attr('checked','checked');
		}
	});
}

if(answer_key.length == 0){
	runBot({'first_time': true, 'practice_test': true});
} else{
	runBot({'first_time': false, 'practice_test': false});
}