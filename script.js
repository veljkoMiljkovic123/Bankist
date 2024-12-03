'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Sarah Smith',
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

const displayMovements = function (movements, sort = false) {
  containerMovements.innerHTML = '';

  const movs = sort ? movements.slice().sort((a, b) => a - b) : movements;

  movs.forEach(function (mov, i) {
    const type = mov > 0 ? 'deposit' : 'withdrawal';

    const html = `
    <div class="movements__row">
          <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type}</div>
          <div class="movements__value">${mov}€</div>
        </div>
    `;
    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

const createUsernames = function (accs) {
  accs.forEach(function (acc) {
    acc.username = acc.owner
      .toLowerCase()
      .split(' ')
      .map(name => name[0])
      .join('');
  });
};
createUsernames(accounts);

const updateUi = function (acc) {
  // Display movements
  displayMovements(acc.movements);

  // Display balance
  calcDisplayBalance(acc);

  // Display summary
  calcDisplaySummary(acc);
};

const calcDisplaySummary = function (acc) {
  const incomes = acc.movements
    .filter(mov => mov > 0)
    .reduce((acc, cur) => acc + cur, 0);
  labelSumIn.innerHTML = ` ${incomes}€`;

  const out = acc.movements
    .filter(mov => mov < 0)
    .reduce((arr, cur) => arr + cur, 0);
  labelSumOut.innerHTML = `${Math.abs(out)}€`;

  const interest = acc.movements
    .filter(mov => mov > 0)
    .map(deposit => (deposit * acc.interestRate) / 100)
    .filter(el => el > 1)
    .reduce((acc, cur) => acc + cur);
  labelSumInterest.innerHTML = `${interest}€`;
};

const calcDisplayBalance = function (acc) {
  acc.balance = acc.movements.reduce((acc, cur) => {
    return acc + cur;
  }, 0);
  labelBalance.innerHTML = `${acc.balance}€`;
};

// Event handler

let currentAccount;

btnLogin.addEventListener('click', function (e) {
  e.preventDefault();

  currentAccount = accounts.find(
    acc => acc.username === inputLoginUsername.value
  );
  console.log(currentAccount);

  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    //Dispay UI and message
    labelWelcome.innerHTML = `Welcome back, ${
      currentAccount.owner.split(' ')[0]
    }`;
    containerApp.style.opacity = '1';

    // Clear fields
    inputLoginUsername.value = '';
    inputLoginPin.value = '';

    updateUi(currentAccount);
  } else {
    inputLoginUsername.value = '';
    inputLoginPin.value = '';
  }
});

// Transfer money

btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = Number(inputTransferAmount.value);
  const receiverAccount = accounts.find(
    acc => acc.username === inputTransferTo.value
  );

  inputTransferTo.value = '';
  inputTransferAmount.value = '';

  if (
    amount > 0 &&
    receiverAccount &&
    amount <= currentAccount.balance &&
    receiverAccount?.username !== currentAccount.username
  ) {
    // Doing the transfer
    currentAccount.movements.push(-amount);
    receiverAccount.movements.push(amount);

    updateUi(currentAccount);
  }
});

//lOAN - se odobrava ako imamo najmanje 1 depozit sa najmanje 10% od kolicine koju zahtevamo za pozajmicu

btnLoan.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = Number(inputLoanAmount.value);
  if (
    amount > 0 &&
    currentAccount.movements.some(move => move >= amount * 0.1)
  ) {
    currentAccount.movements.push(amount);
    updateUi(currentAccount);
  }
  inputLoanAmount.value = '';
});

//Close acount

btnClose.addEventListener('click', function (e) {
  e.preventDefault();

  if (
    inputCloseUsername.value === currentAccount.username &&
    Number(inputClosePin.value) === currentAccount.pin
  ) {
    const index = accounts.findIndex(
      acc => acc.username === currentAccount.username
    );

    // Delete acc
    accounts.splice(index, 1);

    // Hide ui
    containerApp.style.opacity = '0';

    inputCloseUsername.value = '';
    inputClosePin.value = '';
    labelWelcome.innerHTML = 'Log in to get started';
  }
});

let sorted = false;
btnSort.addEventListener('click', function (e) {
  e.preventDefault();
  displayMovements(currentAccount.movements, !sorted);
  sorted = !sorted;
});
/*     */

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

/* const movements = [200, 450, -400, 3000, -650, -130, 70, 1300]; */

////////////////////////////////////////// ///////

/* let arr = ['a', 'b', 'c', 'd', 'e'];
let arr2 = ['j', 'i', 'h', 'g', 'f'];

const latters = arr.concat(arr2);
console.log(latters);
console.log(arr.slice(-1)[0]);

const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

movements.forEach((el, i) => {
  if (el < 0) console.log(`${i}: You withdrew ${Math.abs(el)}`);
  else {
    console.log(`${i}: You deposited ${el}`);
  }
});

///////////////////////////

const currencies = new Map([
  ['USD', 'United States dollar'],
  ['EUR', 'Euro'],
  ['GBP', 'Pound sterling'],
]);

currencies.forEach(function (value, key, map) {
  console.log(`${key} of ${value}`);
});
 */

/* const checkDogs = function (dogsJulia, dogsKate) {
  const juliaCopy = dogsJulia.slice(1, -2);
  const bothArray = [...juliaCopy, ...dogsKate];
  bothArray.forEach(function (dog, i) {
    console.log(
      `${
        dog >= 3
          ? `Dog number ${i + 1} is an adult, and is ${dog} years old`
          : `Dog number ${i + 1} is still a puppy `
      } `
    );
  });
};

checkDogs([9, 16, 6, 8, 3], [10, 5, 6, 1, 4]); */

/* const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

const newMovements = movements.map(mov => mov * 1.1);

console.log(newMovements); */

/* const movements2 = [];
for (let mov of movements) {
  movements2.push(mov * 1.2);
}

console.log(movements2); */

/* const usernames = accounts.map(function (acc, i) {
  return acc.owner;
});

console.log(usernames); */

// filter method
/* const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];
const deposit = movements.filter(mov => mov > 0);
console.log(deposit);
// for of
const deposits = [];
for (const mov of movements) {
  if (mov > 0) {
    deposits.push(mov);
  }
}
console.log(deposits);

const withdrawals = movements.filter(el => el < 0);
console.log(withdrawals);

const balance = movements.reduce((acc, cur, i, arr) => {
  console.log(`Iteration number ${i}: ${acc}`);

  return acc + cur;
}, 100);

console.log(balance);

let sum = 0;
for (const mov of movements) {
  sum += mov;
}
console.log(sum); */

//Maximum value
/* const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

const maxMov = movements.reduce((acc, mov) => {
  if (acc > mov) return acc;
  else return mov;
}, movements[0]);

console.log(maxMov); */

/* Coding Challenge #2
Let's go back to Julia and Kate's study about dogs. This time, they want to convert 
dog ages to human ages and calculate the average age of the dogs in their study */

/* const calcAverageHumanAge = function (ages) {
  const dogHumanAge = ages.map(age => (age <= 2 ? 2 * age : 16 + age * 4));
  console.log(dogHumanAge);
  //vise od 18 godina
  const dogHumanMore18 = dogHumanAge.filter(dog => {
    return dog > 18;
  });
  console.log(dogHumanMore18); */
// prosecna godina ovih starijih od 18
/*   const average =
    dogHumanMore18.reduce((acc, cur) => {
      return acc + cur;
    }, 0) / dogHumanMore18.length;

  return average;
};

const avg1 = calcAverageHumanAge([5, 2, 4, 1, 15, 8, 3]);
console.log(avg1); */

//uzimamo sce movements deposits pretvaramo ih iz eura u dolare i na kraju sabiramo ih sve

/* const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

const totalDepositsUSD = movements
  .filter(mov => mov > 0)
  .map(el => el * 1.1)
  .reduce((acc, curr) => acc + curr);
console.log(totalDepositsUSD); */

/* const calcAverageHumanAge = function (ages) {
  const dogHumanAge = ages.map(age => (age <= 2 ? 2 * age : 16 + age * 4));
  console.log(dogHumanAge);
  //vise od 18 godina
  const dogHumanMore18 = dogHumanAge.filter(dog => {
    return dog > 18;
  });
  console.log(dogHumanMore18);  */
// prosecna godina ovih starijih od 18
/*   const average =
    dogHumanMore18.reduce((acc, cur) => {
      return acc + cur;
    }, 0) / dogHumanMore18.length;

  return average;
};

const avg1 = calcAverageHumanAge([5, 2, 4, 1, 15, 8, 3]);
*/

/* const calcAverageHumanAge = ages => {
  const dogHumanAge = ages
    .map(age => (age <= 2 ? 2 * age : 16 + age * 4))
    .filter(el => el >= 18)
    .reduce((acc, curr, i, arr) => acc + curr / arr.length, 0);
  console.log(dogHumanAge);
};
calcAverageHumanAge([5, 2, 4, 1, 15, 8, 3]); */

/* const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

const firstWithdrawal = movements.find(mov => mov < 0);
console.log(firstWithdrawal);

console.log(accounts);
const account = accounts.find(acc => acc.username === 'stw');
console.log(account);

for (let acc of accounts) {
  if (acc.username === 'jd') {
    console.log(acc);
  }
} */
/* const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

console.log(movements);
console.log(movements.includes(-130));

const anyDeposits = movements.some(mov => mov > 2000);
console.log(anyDeposits); */

/* const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];
console.log(movements.every(mov => mov > 0));
console.log(account4.movements.every(mov => mov > 0)); */

/* const arr = [[1, 2, 3], [4, 5, [6, 6, 6]], 7, 8];
const separateElementArr = arr.flat(2);
console.log(separateElementArr);
const arrDeep = [[[1, 2], 3], [4, [5, 6]], 7, 8];
console.log(arrDeep.flat(2));

console.log(
  accounts.flatMap(acc => acc.movements).reduce((acc, cur) => acc + cur)
); */

// Strings
/* const owners = ['Jonas', 'Zach', 'Adam', 'Martha'];
console.log(owners.sort()); */

//Numbers
/* const movements = [200, 450, -400, 3000, -650, -130, 70, 1300]; */

/* movements.sort((a, b) => {
  if (a > b) return 1;
  if (a < b) return -1;
});
console.log(movements); */

/* movements.sort((a, b) => a - b);
console.log(movements);

movements.sort((a, b) => b - a);
console.log(movements); */
