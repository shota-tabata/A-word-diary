/* jshint curly:true, debug:true */
/* globals $, firebase */

const resetCalendarView = () => {
  //$('#calendar').empty();
};

const loadCalendarView = () => {
  resetCalendarView();
};

//画面の表示切替
const showView = (id) => {
  $('.view').hide();
  $(`#${id}`).fadeIn();

  if (id === 'calendar') {
    loadCalendarView();
  }
};

//ログイン関連

const resetLoginForm = () => {
  $('#login__help').hide();
  $('#login__submit-button')
    .prop('disabled', false)
    .text('ログイン');
};

const onLogin = () => {
  console.log('ログイン完了');

  showView('calendar');
};

const onLogout = () => {
  const booksRef = firebase.database().ref('books');

  booksRef.off('child_removed');
  booksRef.off('child_added');

  showView('login');
};

//ログイン機能のイベントハンドラ
firebase.auth().onAuthStateChanged((user) => {
  if (user) {
    console.log('ログイン成功');
    onLogin();
  } else {
    console.log('ログインしていません');
    onLogout();
  }
});

$('#login-form').on('submit', (e) => {
  e.preventDefault();

  const $loginButton = $('#login__submit-button');
  $loginButton.text('送信中…');

  const email = $('#login-email').val();
  const password = $('#login-password').val();

  firebase
    .auth()
    .signInWithEmailAndPassword(email, password)
    .then(() => {
      console.log('ログインしました。');

      resetLoginForm();
    })
    .catch((error) => {
      console.error('ログインエラー', error);

      $('#login__help')
        .text('ログインに失敗しました。')
        .show();

      // ログインボタンを元に戻す
      $loginButton.text('ログイン');
    });
});

$('.logout-button').on('click', () => {
  firebase
    .auth()
    .signOut()
    .catch((error) => {
      console.error('ログアウトに失敗:', error);
    });
});

