// DOM'dan gerekli elementleri al
const quizContainer = document.getElementById('quiz-container');
const questionContainer = document.getElementById('question-container');
const answersContainer = document.getElementById('answers-container');
const timerContainer = document.getElementById('timer-container');

// Quiz verilerini ve durumlarını takip etmek için değişkenler
let currentQuestionIndex = 0;
let userAnswers = [];
let questions = [];
let isAnswerable = false;
let timerInterval;

// Mock sorular, daha sonra backend'den alınacak şekilde ayarlayabilirsiniz
async function fetchQuestions() {
  try {
    // JSONPlaceholder'dan veri çek
    const response = await fetch('https://jsonplaceholder.typicode.com/posts');
    const data = await response.json();

    // İlk 5 soruyu al ve her bir soruyu formatla
    questions = data.slice(0, 5).map((item, index) => ({
      title: `Question ${index + 1}: ${item.title}`,
      options: generateOptionsWithShortWords(item.title),
      correctAnswer: Math.floor(Math.random() * 4)
    }));

    // İlk soruyu görüntüle
    displayQuestion();
  } catch (error) {
    console.error('Error fetching questions:', error);
  }
}

// Soru metinlerini kısa kelimelerle birleştirmek için yardımcı fonksiyon
function generateOptionsWithShortWords(questionText) {
  const shortWords = ['apple', 'banana', 'cat', 'dog', 'elephant'];
  const options = ['A', 'B', 'C', 'D'];

  return options.map((option, index) => `${option} - ${shortWords[index] || 'random'}`);
}

// Soruyu ekrana görüntülemek için fonksiyon
function displayQuestion() {
  const question = questions[currentQuestionIndex];

  // Soru metnini HTML olarak ayarla
  questionContainer.innerHTML = `<p>${question.title}</p>`;

  // Şıkları HTML olarak ayarla
  answersContainer.innerHTML = '';
  question.options.forEach((option, index) => {
    const button = document.createElement('button');
    button.innerHTML = option;
    button.addEventListener('click', () => isAnswerable && selectAnswer(index));
    answersContainer.appendChild(button);
  });

  // Şıklara tıklanamazlık durumunu başlat
  isAnswerable = false;

  // İlk on saniye boyunca uyarı mesajı göster
  displayAlert('10 saniye boyunca şık işaretlenemez!!');

  // İlk on saniye sonunda şıklara tıklanabilirlik durumunu güncelle
  setTimeout(() => {
    isAnswerable = true;
    removeAlert(); // İlk 10 saniye bittiğinde uyarıyı kaldır
  }, 10000);

  // 30 saniyelik bir süre boyunca soruyu görüntüle ve timer'ı başlat
  startTimer(30);
}

// Şık seçildiğinde yapılacak işlemleri içeren fonksiyon
function selectAnswer(index) {
  // Kullanıcının cevabını kaydet
  userAnswers[currentQuestionIndex] = index;

  // Şıkları devre dışı bırak
  answersContainer.querySelectorAll('button').forEach(button => {
    button.disabled = true;
  });

  // Timer'ı durdur ve bir sonraki soruya geç
  stopTimer();
  nextQuestion();
}

// Bir sonraki soruyu görüntülemek için fonksiyon
function nextQuestion() {
  // Bir sonraki soruya geç
  currentQuestionIndex++;

  // Eğer sorular bitmediyse bir sonraki soruyu görüntüle, aksi takdirde quiz'i bitir
  if (currentQuestionIndex < questions.length) {
    displayQuestion();
  } else {
    finishQuiz();
  }
}

// Quiz'i bitirmek için fonksiyon
function finishQuiz() {
  // Quiz bitti mesajını ekrana yazdır
  quizContainer.innerHTML = '<h2>Quiz Finished!</h2>';

  // Doğru cevapları ve kullanıcının verdiği cevapları tablo halinde göster
  const table = document.createElement('table');
  userAnswers.forEach((answer, index) => {
    const row = table.insertRow();
    const cell1 = row.insertCell(0);
    const cell2 = row.insertCell(1);
    const correctAnswer = questions[index].correctAnswer;
    const isCorrect = answer !== undefined && answer === correctAnswer;

    cell1.innerHTML = `Question ${index + 1}`;
    cell2.innerHTML = `Answer: ${answer !== undefined ? questions[index].options[answer] : 'Not answered'} (${isCorrect ? 'Correct' : 'Incorrect'})`;

    // Eğer cevap verilmediyse, doğru cevabı göster
    if (answer === undefined) {
      cell2.innerHTML += `<br>Correct Answer: ${questions[index].options[correctAnswer]}`;
    }
  });

  // Tabloyu ekrana ekleyerek quiz sonlandır
  quizContainer.appendChild(table);
}

// Timer'ı başlatmak için fonksiyon
function startTimer(seconds) {
  let remainingTime = seconds;
  timerContainer.innerText = `Time: ${remainingTime}s`;

  timerInterval = setInterval(() => {
    remainingTime--;
    timerContainer.innerText = `Time: ${remainingTime}s`;

    // Timer bittiğinde timer'ı durdur ve bir sonraki soruya geç
    if (remainingTime <= 0) {
      stopTimer();
      nextQuestion();
    }
  }, 1000);
}

// Timer'ı durdurmak için fonksiyon
function stopTimer() {
  clearInterval(timerInterval);
}

// Uyarı mesajı göstermek için fonksiyon
function displayAlert(message) {
  const alertDiv = document.createElement('div');
  alertDiv.className = 'alert';
  alertDiv.innerText = message;

  document.body.appendChild(alertDiv);
}

// Uyarı mesajını kaldırmak için fonksiyon
function removeAlert() {
  const alertDiv = document.querySelector('.alert');
  if (alertDiv) {
    alertDiv.remove();
  }
}

// Quiz'i başlat
fetchQuestions();
