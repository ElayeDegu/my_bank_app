'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Elias Degu',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
  movementsDates: [
    '2019-11-18T21:31:17.178Z',
    '2019-12-23T07:42:02.383Z',
    '2020-01-28T09:15:04.904Z',
    '2020-04-01T10:17:24.185Z',
    '2020-05-08T14:11:59.604Z',
    '2022-03-02T17:01:17.194Z',
    '2022-03-05T23:36:17.929Z',
    '2022-03-06T10:51:36.790Z',
  ],
  currency: 'USD',
  locale: 'en-US', // de-DE
};

const account2 = {
  owner: 'Esku Sema',
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
  currency: 'EUR',
  locale: 'en-GB',
};

const account3 = {
  owner: 'Elda Ediii',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
  movementsDates: [
    '2019-11-18T21:31:17.178Z',
    '2019-12-23T07:42:02.383Z',
    '2020-01-28T09:15:04.904Z',
    '2020-04-01T10:17:24.185Z',
    '2020-05-08T14:11:59.604Z',
    '2022-03-02T17:01:17.194Z',
    '2022-03-05T23:36:17.929Z',
    '2022-03-06T10:51:36.790Z',
  ],
  currency: 'USD',
  locale: 'en-US', // de-DE
};

const account4 = {
  owner: 'Kuke Kuke',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

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

// Functions

const formatMovementDate = function (date, locale) {
  const calcDaysPassed = (date1, date2) =>
    Math.round(Math.abs(date1 - date2) / (1000 * 60 * 60 * 24));

  const daysPassed = calcDaysPassed(new Date(), date);
  console.log(daysPassed);

  if (daysPassed === 0) return 'Today';
  if (daysPassed === 1) return 'Yesterday';
  if (daysPassed <= 7) return `${daysPassed} days ago`;
  return new Intl.DateTimeFormat(locale).format(date);

  // const day = `${date.getDay()}`.padStart(2, 0);
  // const mon = `${date.getMonth() + 1}`.padStart(2, 0);
  // const year = date.getFullYear();

  // return `${day}/${mon}/${year}`;
};
const formatCur = function (value, locale, currency) {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
  }).format(value);
};

const displayMovements = function (acc, sort = false) {
  containerMovements.innerHTML = '';

  // Sorting
  const movs = sort
    ? acc.movements.slice().sort((a, b) => a - b)
    : acc.movements;

  movs.forEach(function (mov, i) {
    const type = mov > 0 ? 'deposit' : 'withdrawal';

    const date = new Date(acc.movementsDates[i]);

    const displayDate = formatMovementDate(date, acc.locale);

    const formattedMov = formatCur(mov, acc.locale, acc.currency);

    const html = `
    <div class="movements__row">
      <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type}</div>
    <div class="movements__date">${displayDate}</div>
      <div class="movements__value">${formattedMov}</div>
    </div>
    `;

    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

const calcDisplayBalance = function (acc) {
  acc.balance = acc.movements.reduce(function (acc, cur) {
    return acc + cur;
  }, 0);
  labelBalance.textContent = formatCur(acc.balance, acc.locale, acc.currency);
};

const calcDisplaySummary = function (acc) {
  const incomes = acc.movements
    .filter(mov => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumIn.textContent = formatCur(incomes, acc.locale, acc.currency);

  const out = acc.movements
    .filter(mov => mov < 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumOut.textContent = formatCur(out, acc.locale, acc.currency);

  const interest = acc.movements
    .filter(mov => mov > 0)
    .map(mov => (mov * acc.interestRate) / 100)
    .filter((int, i, arr) => {
      return int >= 1;
    })
    .reduce((acc, mov) => acc + mov, 0);
  labelSumInterest.textContent = formatCur(interest, acc.locale, acc.currency);
};

const createUsernames = accs => {
  accs.forEach(acc => {
    acc.username = acc.owner
      .toLowerCase()
      .split(' ')
      .map(name => name[0])
      .join('');
  });
};
createUsernames(accounts);

const updateUI = acc => {
  // Display movements
  displayMovements(acc);

  // Display balance
  calcDisplayBalance(acc);

  //Display summary
  calcDisplaySummary(acc);
};

const startLogoutTimer = function () {
  const tick = function () {
    const min = String(Math.trunc(time / 60)).padStart(2, 0);
    const sec = String(time % 60).padStart(2, 0);
    // In each call, print the remaining time to UI
    labelTimer.textContent = `${min}:${sec}`;

    // when 0 sec, stop timer and logout user
    if (time === 0) {
      clearInterval(timer);
      labelWelcome.textContent = 'Log in to get started';
      containerApp.style.opacity = 0;
    }
    // Decrease 1 sec
    time--;
  };
  // Set time to 5 min
  let time = 120;

  // call the timer every second
  tick();
  const timer = setInterval(tick, 1000);

  return timer;
};
// Event Handler
let currentAccount, timer;

// FAKE ALWAYS LOGGED IN
// currentAccount = account1;
// updateUI(currentAccount);
// containerApp.style.opacity = 100;

btnLogin.addEventListener('click', function (e) {
  e.preventDefault();

  currentAccount = accounts.find(
    acc => acc.username === inputLoginUsername.value
  );
  console.log(currentAccount);

  if (currentAccount?.pin === +inputLoginPin.value) {
    // Display UI and message
    labelWelcome.textContent = `Welcome back, ${
      currentAccount.owner.split(' ')[0]
    }`;
    containerApp.style.opacity = 100;

    // Date
    const now = new Date();
    const options = {
      hour: 'numeric',
      minute: 'numeric',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      weekday: 'long',
    };
    const locale = navigator.language;
    console.log(locale);
    labelDate.textContent = new Intl.DateTimeFormat(
      currentAccount.locale,
      options
    ).format(now);
    // const day = `${now.getDay()}`.padStart(2, 0);
    // const mon = `${now.getMonth() + 1}`.padStart(2, 0);
    // const year = now.getFullYear();
    // const hour = `${now.getHours()}`.padStart(2, 0);
    // const min = `${now.getMinutes()}`.padStart(2, 0);
    // labelDate.textContent = `${day}/${mon}/${year} , ${hour}:${min}`;

    // clear the input fields
    inputLoginUsername.value = inputLoginPin.value = '';

    inputLoginPin.blur();

    // Timer
    if (timer) clearInterval(timer);

    timer = startLogoutTimer();

    // Update UI
    updateUI(currentAccount);
  }
});

btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = +inputTransferAmount.value;
  const receiverAcc = accounts.find(
    acc => acc.username === inputTransferTo.value
  );
  console.log(amount, receiverAcc);
  // clear the input fields
  inputTransferAmount.value = inputTransferTo.value = '';

  if (
    amount > 0 &&
    receiverAcc &&
    currentAccount.balance >= amount &&
    receiverAcc?.username !== currentAccount.username
  ) {
    // Doing the transfer
    currentAccount.movements.push(-amount);
    receiverAcc.movements.push(amount);

    // Add transfer Date
    currentAccount.movementsDates.push(new Date().toISOString());
    receiverAcc.movementsDates.push(new Date().toISOString());
    // Update UI
    updateUI(currentAccount);

    // Reset timer
    clearInterval(timer);
    timer = startLogoutTimer();
  }
});

btnLoan.addEventListener('click', function (e) {
  e.preventDefault();

  const amount = Math.floor(inputLoanAmount.value);

  if (amount > 0 && currentAccount.movements.some(mov => mov >= mov * 0.1)) {
    setTimeout(function () {
      // Add Movement or Doing the Loan
      currentAccount.movements.push(amount);

      // Add loan Date
      currentAccount.movementsDates.push(new Date().toISOString());

      // Update UI
      updateUI(currentAccount);
      // Reset timer
      clearInterval(timer);
      timer = startLogoutTimer();
    }, 2500);
  }

  // clear the input fields
  inputLoanAmount.value = '';
});

btnClose.addEventListener('click', function (e) {
  e.preventDefault();

  if (
    inputCloseUsername.value !== currentAccount.username &&
    +inputClosePin.value !== currentAccount.pin
  ) {
    // The FindIndex Method
    // returns the index of the found element and not the element itself
    const index = accounts.findIndex(
      acc => acc.username === currentAccount.username
    );
    console.log(index);

    // Delete account
    accounts.splice(index, 1);

    // Hide UI
    containerApp.style.opacity = 0;

    console.log(accounts);
  }

  // clear the input fields
  inputCloseUsername.value = inputClosePin.value = '';
});

let sorted = false;
btnSort.addEventListener('click', function (e) {
  e.preventDefault();
  displayMovements(currentAccount.movements, !sorted);
  sorted = !sorted;
});
// const createUsernames = user => {
//   const username = user
//     .toLowerCase()
//     .split(' ')
//     .map(name => name[0])
//     .join('');
//   return username;
// };
// console.log(createUsernames('Elda Ediii'));
// const user = 'Elda Ediii'; // ee

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

// const currencies = new Map([
//   ['USD', 'United States dollar'],
//   ['EUR', 'Euro'],
//   ['GBP', 'Pound sterling'],
// ]);

// const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

// /////////////////////////////////////////////////

//  Looping Arrays for - of
// for (const [i, mov] of movements.entries()) {
//   if (mov > 0) {
//     console.log(`Movement ${i + 1} : Deposited Account : ${mov}`);
//   } else {
//     console.log(`Movement ${i + 1} : Withdrew Account : ${Math.abs(mov)}`);
//   }
// }
// console.log(`------ FOREACH ----`);
//  Looping Arrays forEach
// movements.forEach(function (mov, i, arr) {
//   if (mov > 0) {
//     console.log(`Movement ${i + 1} : Deposited Account : ${mov}`);
//   } else {
//     console.log(`Movement ${i + 1} : Withdrew Account : ${Math.abs(mov)}`);
//   }
// });

// Coding Challenge
// const checkDogs = (dogsJulia, dogsKate) => {
//   const dogsJulias = [...dogsJulia];
//   console.log(dogsJulias);
//   const correctedJulia = dogsJulia.splice(1, 2);
//   console.log(correctedJulia);
//   const dogsJK = [...correctedJulia, ...dogsKate];
//    OR const dogsJK = correctedJulia.concat(dogsKate)
//   console.log(dogsJK);
//   dogsJK.forEach(function (myDogs, i) {
//     if (myDogs >= 3) {
//       console.log(
//         `Dog Number ${i + 1} is an adult, and is ${myDogs} years old`
//       );
//     } else {
//       console.log(`Dog Number ${i + 1} is still a  puppy`);
//     }
//   });
// };

// checkDogs([3, 5, 2, 12, 7], [4, 1, 15, 8, 3]);
// checkDogs([9, 16, 6, 8, 3], [10, 5, 6, 1, 4]);

// Data Transformations with MAP, FILTER AND REDUCE
// MAP --> returns a new array containing the results of applying an operation on all original array elements.
// FILTER --> returns a new array containing the array elements that passed a specified test conditions
// REDUCE --> boils all array elements down to one single value (e.g adding all elements together).

// The Map Method
// const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];
// const euroUsd = 1.1;

// const moveUSD = movements.map(mov => {
//   return mov * euroUsd;
// });
// console.log(moveUSD);

// const movDesc = movements.map(
//   (mov, i) =>
//     `Movement ${i + 1} : ${mov > 0 ? 'Deposited' : 'Withdrew'} : ${Math.abs(
//       mov
//     )}`
// );
// console.log(movDesc);

// The Filter Method
// const deposits = movements.filter(function (mov) {
//   return mov > 0;
// });
// const withdrawal = movements.filter(function (movv) {
//   return movv < 0;
// });

// console.log(movements);
// console.log(deposits);
// console.log(withdrawal);

//  the for -of loop
// const depositsFor = [];
// for (const mov of movements) if (mov > 0) depositsFor.push(mov);
// console.log(depositsFor);

// const withdrewForm = [];
// for (const movv of movements) if (movv < 0) withdrewForm.push(movv);
// console.log(withdrewForm);

// The Reduce Method
// console.log(movements);

//  Arrow Function
// const balances = movements.reduce((acc, cur) => acc + cur, 0);
// console.log(balances);

// const balance = movements.reduce(function (acc, cur, i, arr) {
//   console.log(`Iteration ${i} : ${acc}, when ${cur}`);
//   return acc + cur;
// }, 0);
// console.log(balance);

// Maximum Value
// const max = movements.reduce((acc, mov) => {
//   if (acc > mov) {
//     return acc;
//   } else {
//     return mov;
//   }
// }, movements[0]);
// console.log(max);

//  the for -of loop
// let balance2 = 0;
// for (const mov of movements) balance2 += mov;
// console.log(balance2);

// Coding Challenge
// const ages = [5, 2, 4, 1, 15, 8, 3];
// const calcAverageHumanAge = function (ages) {
//   const humanAges = ages.map(age => {
//     if (age <= 2) {
//       return 2 * age;
//     } else {
//       return 16 + age * 4;
//     }
//   });
//   console.log(humanAges);

//   const lessAges = humanAges.filter(agess => {
//     return agess >= 18;
//   });
//   console.log(lessAges);

//   const aveHumanAge =
//     lessAges.reduce((acc, cur) => acc + cur, 0) / lessAges.length;

//   const aveHumanAge = lessAges.reduce(
//     (acc, cur, i, arr) => acc + cur / arr.length,
//     0
//   );
//   return aveHumanAge;
// };
// const avg1 = calcAverageHumanAge(ages);
// console.log(avg1);

// Chaining Methods
// const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];
// const euroUsd = 1.1;

// const totalDepositSUSD = movements
//   .filter(mov => mov > 0)
//   .map(mov => mov * euroUsd)
//   .reduce((acc, mov) => acc + mov, 0);

// console.log(totalDepositSUSD);

// const ages = [5, 2, 4, 1, 15, 8, 3];
// const calcAverageHumanAge = function (ages) {
//   const humanAges = ages.map(age => {
//     if (age <= 2) {
//       return 2 * age;
//     } else {
//       return 16 + age * 4;
//     }
//   });
//   console.log(humanAges);

//   const lessAges = humanAges.filter(agess => {
//     return agess >= 18;
//   });
//   console.log(lessAges);

//   const aveHumanAge =
//     lessAges.reduce((acc, cur) => acc + cur, 0) / lessAges.length;

//   const aveHumanAge = lessAges.reduce(
//     (acc, cur, i, arr) => acc + cur / arr.length,
//     0
//   );
//   return aveHumanAge;
// };
// const avg1 = calcAverageHumanAge(ages);
// console.log(avg1);

// Coding Challenge
// const ages = [5, 2, 4, 1, 15, 8, 3];
// const calcAverageHumanAge = ages =>
//   ages
//     .map(age => (age <= 2 ? 2 * age : 16 + age * 4))
//     .filter(age => age >= 18)
//     .reduce((acc, age, i, arr) => acc + age / arr.length, 0);

// const age1 = calcAverageHumanAge(ages);
// console.log(age1);

// The Find Method
// to retrieve one element of an array based on a condition.
// also accepts a callback function (mov) that will be called as the method loops over the array
// another method that loop on array

// const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];
// const firstWithdrawal = movements.find(mov => mov < 0);
// console.log(movements);
// console.log(firstWithdrawal);

// console.log(accounts);

// const account = accounts.find(acc => acc.owner === 'Elda Ediii');
// console.log(account);

// Sorting Array
// return < 0, A, B (Keep Order)
// return > 0, B, A (Switch order)
// const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];
// console.log(movements);

// // Ascending
// movements.sort((a, b) => {
//   if (a > b) return 1;
//   if (a < b) return -1;
// });
// console.log(movements);

// // Descending
// movements.sort((a, b) => {
//   if (a > b) return -1;
//   if (a < b) return 1;
// });
// console.log(movements);

// Numbers and Date
// Converting And Checking Numbers

// Base 10 => 0 to 9
// Binary base 2 => 0 & 1
// console.log(0.1 + 0.2);
// console.log(0.1 + 0.2 === 0.3);

// // Conversion
// console.log(Number('23'));
// console.log(+'23');

// // Parsing
// console.log(Number.parseInt('30px', 10));
// console.log(Number.parseInt('e23', 10));

// console.log(Number.parseInt('2.5rem'));
// console.log(Number.parseFloat('2.5rem'));

// // Check if value is NAN(not a number)
// console.log(Number.isNaN(20));
// console.log(Number.isNaN('20'));
// console.log(Number.isNaN(+'20X'));
// console.log(Number.isNaN(22 / 0));

// // Checking if value is number
// console.log(Number.isFinite(20));
// console.log(Number.isFinite('20'));
// console.log(Number.isFinite(+'20X'));
// console.log(Number.isFinite(22 / 0));

// console.log(Number.isInteger(22));
// console.log(Number.isInteger(22.0));
// console.log(Number.isInteger(22 / 0));

// Math and Rounding
// Math
// console.log(Math.sqrt(25));
// console.log(25 ** (1 / 2));
// console.log(8 ** (1 / 3));

// console.log(Math.max(4, 22, 11, 8, 2));
// console.log(Math.min(4, 22, 11, 8, 2));

// console.log(Math.PI * Number.parseFloat('10px') ** 2);
// console.log(Math.trunc(Math.random() * 6) + 1);

// const randomInt = (min, max) =>
//   Math.floor(Math.random() * (max - min) + 1) + min;

// console.log(randomInt(10, 20));

// // Rounding integers
// console.log(Math.round(23.3));
// console.log(Math.round(23.9));

// console.log(Math.ceil(23.3));
// console.log(Math.ceil(23.9));

// console.log(Math.floor(23.3));
// console.log(Math.floor(23.9));

// console.log(Math.trunc(-23.3));
// console.log(Math.floor(-23.3));

// // Rounding decimals
// console.log((2.7).toFixed(0));
// console.log((2.7).toFixed(3));
// console.log((2.345).toFixed(2));
// console.log(+(2.345).toFixed(2));

// The Remainder Operator
// const isEven = n => n % 2 === 0;
// console.log(isEven(8));
// console.log(isEven(11));
// console.log(isEven(238));

// labelBalance.addEventListener('click', function () {
//   [...document.querySelectorAll('.movements__row')].forEach(function (row, i) {
//     // 0,2 ,4, 6
//     if (i % 2 === 0) row.style.backgroundColor = 'orangered';
//     //0, 3, 6, 9
//     if (i % 3 === 0) row.style.backgroundColor = 'blue';
//   });
// });

// Date and Time
// Create Date
// const now = new Date();
// console.log(now);

// console.log(new Date('Mar 07 2022 17:00:21'));
// console.log(new Date('December 24, 2015'));
// console.log(new Date(account1.movementsDates[0]));

// console.log(new Date(1993, 8, 28, 12, 32, 55));
// console.log(new Date(1993, 8, 28));

// console.log(new Date(0));
// console.log(new Date(3 * 24 * 60 * 60 * 1000));

// Working with Date
// const future = new Date(1993, 8, 28, 12, 32);
// console.log(future);
// console.log(future.getFullYear());
// console.log(future.getMonth());
// console.log(future.getDate());
// console.log(future.getDay());
// console.log(future.getHours());
// console.log(future.getMinutes());
// console.log(future.getSeconds());
// console.log(future.toISOString());
// console.log(future.getTime());

// console.log(new Date(749208720000));

// Operation with dates
// const future = new Date(1993, 8, 28, 12, 32);
// console.log(future);

// const calcDaysPassed = (date1, date2) =>
//   Math.abs(date1 - date2) / (1000 * 60 * 60 * 24);

// const day1 = calcDaysPassed(new Date(1993, 8, 28), new Date(1993, 8, 18));
// console.log(day1);

//setTimeout
// const ingredients = ['olives', 'spinach'];
// const pizzaTimer = setTimeout(
//   (ing1, ing2) => console.log(`Here is your pizza with ${ing1} and ${ing2}`),
//   3000,
//   ...ingredients
// );
// console.log('waiting ....');
// if (ingredients.includes('spinach')) clearTimeout(pizzaTimer);

// // setInterval
// setInterval(function () {
//   const now = new Date();
//   console.log(now);
// }, 1000);
