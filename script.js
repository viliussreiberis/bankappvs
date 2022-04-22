'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
  interestRate: 1.2, // %
  pin: 1111,

  movementsDates: [
    '2019-11-18T21:31:17.178Z',
    '2019-12-23T07:42:02.383Z',
    '2020-01-28T09:15:04.904Z',
    '2020-04-01T10:17:24.185Z',
    '2020-09-01T14:11:59.604Z',
    '2021-09-10T17:01:17.194Z',
    '2021-09-11T23:36:17.929Z',
    '2021-09-13T10:51:36.790Z',
  ],
  currency: 'EUR',
  locale: 'pt-PT', // de-DE
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,

  movementsDates: [
    '2019-11-01T13:15:33.035Z',
    '2019-11-30T09:48:16.867Z',
    '2019-12-25T06:04:23.907Z',
    '2020-01-25T14:18:46.235Z',
    '2020-02-05T16:33:06.386Z',
    '2020-04-10T14:43:26.374Z',
    '2020-06-25T18:49:59.371Z',
    '2020-07-26T12:01:20.894Z',
  ],
  currency: 'USD',
  locale: 'en-US',
};

const accounts = [account1, account2];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

// Dates
const formatDate = function (date, locale) {
  const calcPassedDays = function (date2, date1) {
    return Math.round(Math.abs(date2 - date1) / (1000 * 24 * 60 * 60));
  };

  const dayPasses = calcPassedDays(new Date(), date);
  console.log(dayPasses);

  if (dayPasses === 0) return 'Today';
  if (dayPasses === 1) return 'Yesterday';
  if (dayPasses <= 7) return `${dayPasses} days ago`;

  return new Intl.DateTimeFormat(locale).format(date);
};

// Formating values
const formatMovementValue = function (value, currency, locale) {
  return Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
  }).format(value);
};

// Logout functionality
let interval;

const setTimeLogout = function () {
  const tick = function () {
    labelTimer.textContent = `${String(Math.trunc(time / 60)).padStart(
      2,
      0
    )} : ${String(time % 60).padStart(2, 0)}`;

    if (time === 0) {
      clearInterval(interval);
      labelWelcome.textContent = 'Log in to get started';
      containerApp.style.opacity = 0;
    }

    time--;
  };

  let time = 30;

  tick();
  interval = setInterval(tick, 1000);

  return interval;
};

// 1. Display movements
const displayMovements = function (acc, sorted = false) {
  containerMovements.innerHTML = '';
  const movs = sorted
    ? acc.movements.slice().sort((a, b) => a - b)
    : acc.movements;
  console.log(movs);

  movs.forEach(function (mov, i) {
    const type = mov > 0 ? 'deposit' : 'withdrawal';
    const date = new Date(acc.movementsDates[i]);
    const formatedDate = formatDate(date, acc.locale);
    const formatedMovements = formatMovementValue(
      mov,
      acc.currency,
      acc.locale
    );
    const html = `<div class="movements__row">
          <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type}</div>
          <div class="movements__date">${formatedDate}</div>
          <div class="movements__value">${formatedMovements}</div>
        </div>`;

    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

// 2. Creating usernames
const createUserName = function (accs) {
  accs.forEach(function (acc) {
    acc.username = acc.owner
      .toLowerCase()
      .split(' ')
      .map(value => value[0])
      .join('');
  });
};

createUserName(accounts);

// 3. Calc and display balance
const calcDisplayBalance = function (acc) {
  acc.balance = acc.movements.reduce((acc, mov) => acc + mov, 0);
  labelBalance.textContent = `${formatMovementValue(
    acc.balance,
    acc.currency,
    acc.locale
  )}`;
};

// 4. calc and display summary
const calcDisplaySummary = function (acc) {
  const incomes = acc.movements
    .filter(mov => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumIn.textContent = `${formatMovementValue(
    incomes,
    acc.currency,
    acc.locale
  )}`;

  const outcomes = acc.movements
    .filter(mov => mov < 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumOut.textContent = `${formatMovementValue(
    Math.abs(outcomes),
    acc.currency,
    acc.locale
  )}`;

  const interest = acc.movements
    .filter(mov => mov > 0)
    .reduce((acc, mov) => (acc + mov) * 0.12, 0)
    .toFixed(2);
  labelSumInterest.textContent = formatMovementValue(
    interest,
    acc.currency,
    acc.locale
  );
};

calcDisplaySummary(accounts[0]);

// Update UI
const updateUI = function (acc) {
  displayMovements(acc);
  calcDisplayBalance(acc);
  calcDisplaySummary(acc);
};

// 5. Login functionality
let currentAccount;

//Login acc 1 permanently
currentAccount = account1;
containerApp.style.opacity = 1;
updateUI(currentAccount);

btnLogin.addEventListener('click', function (e) {
  e.preventDefault();
  currentAccount = accounts.find(
    acc => acc.username === inputLoginUsername.value
  );

  if (currentAccount.pin === Number(inputLoginPin.value)) {
    labelWelcome.textContent = `Welcome back ${
      currentAccount.owner.split(' ')[0]
    }`;

    updateUI(currentAccount);

    const now = new Date();
    const renewLabelDate = new Intl.DateTimeFormat(
      currentAccount.locale
    ).format(now);
    labelDate.textContent = renewLabelDate;

    containerApp.style.opacity = 100;
    inputLoginUsername.value = inputLoginPin.value = '';
    inputLoginPin.blur();

    // SetInterval functionality
    if (interval) {
      clearInterval(interval);
    }
    interval = setTimeLogout();
  }
});

// 6. Transfer money functionality
btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();
  const receiver = accounts.find(acc => acc.username === inputTransferTo.value);
  const amount = Number(inputTransferAmount.value);
  console.log(receiver);
  if (
    currentAccount.username !== receiver.username &&
    amount <= currentAccount.balance &&
    amount > 0
  ) {
    // Add new date to movements Date
    currentAccount.movementsDates.push(new Date().toISOString());

    currentAccount.movements.push(-amount);
    receiver.movements.push(amount);

    updateUI(currentAccount);
    inputTransferTo.value = inputTransferAmount.value = '';
    inputTransferAmount.blur();

    // Rewew setInterval
    clearInterval(interval);
    setTimeLogout();
  }
});

// 7. Close account functionality

btnClose.addEventListener('click', function (e) {
  e.preventDefault();
  const index = accounts.findIndex(
    acc => acc.username === inputCloseUsername.value
  );
  console.log(index);
  if (currentAccount.pin === Number(inputClosePin.value)) {
    accounts.splice(index, 1);
    containerApp.style.opacity = 0;

    inputCloseUsername.value = inputClosePin.value = '';
    inputClosePin.blur();
  }
});

// 8. Loan functionality
btnLoan.addEventListener('click', function (e) {
  e.preventDefault();
  const request = Number(inputLoanAmount.value);
  const anyDeposit = currentAccount.movements
    .filter(mov => mov > 0)
    .some(value => value > request);
  if (anyDeposit) {
    // Add new date to movements Date
    setTimeout(function () {
      currentAccount.movementsDates.push(new Date().toISOString());

      currentAccount.movements.push(request);

      updateUI(currentAccount);
    }, 3000);
  }
  inputLoanAmount.value = '';

  // Rewew setInterval
  clearInterval(interval);

  setTimeLogout();
});

// 9. Sort functionality
let sorted = false;
btnSort.addEventListener('click', function (e) {
  e.preventDefault();

  displayMovements(currentAccount, !sorted);
  sorted = !sorted;
  console.log(sorted);
});

// displayMovements(movements);
/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

const currencies = new Map([
  ['USD', 'United States dollar'],
  ['EUR', 'Euro'],
  ['GBP', 'Pound sterling'],
]);

/////////////////////////////////////////////////
