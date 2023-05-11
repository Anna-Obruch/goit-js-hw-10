import './css/styles.css';
import debounce from 'lodash.debounce';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import { fetchCountries } from './js/fetchCountries';

const DEBOUNCE_DELAY = 300;

const searchBox = document.querySelector('#search-box');
const countryList = document.querySelector('.country-list');
const countryInfo = document.querySelector('.country-info');

searchBox.addEventListener('input', debounce(onInput, DEBOUNCE_DELAY));

function onInput(e) {
  let inputCountry = e.target.value.trim();

  if (inputCountry) {
    return fetchCountries(inputCountry)
    .then(data => {
      renderCountries(data);
    })
    .catch(error => {
        addHidden();
       clearInterfaceUI();
        Notify.failure('Oops, there is no country with that name');
  })
}
}



const listCountries = data =>
  data.reduce(
    (previousValue, { name: { official, common }, flags: { svg } }) => {
      return (
        previousValue +
        `<li> <img src="${svg}" alt="${common}" width="50">
        <p>${official}</p>
        </li>`
      );
    },
    ''
  );

const oneCountry = data =>
  data.reduce(
    (
      previousValue,
      { flags: { svg }, name, capital, population, languages }
    ) => {
      console.log(languages);
      languages = Object.values(languages).join(', ');
      console.log(name);
      return (
        previousValue +
        `<img src="${svg}" alt="${name}" width="320" height="auto">
<p> ${name.official}</p>
<p>Capital: <span> ${capital}</span></p>
<p>Population: <span> ${population}</span></p>
<p>Languages: <span> ${languages}</span></p>`
      );
    },
    ''
  );

function renderCountries(result) {
  if (result.length === 1) {
    countryList.innerHTML = '';
    countryList.style.visibility = 'hidden';
    countryInfo.style.visibility = 'visible';
    return (countryInfo.innerHTML = oneCountry(result));
  }

  if (result.length >= 2 && result.length <= 10) {
    countryInfo.innerHTML = '';
    countryInfo.style.visibility = 'hidden';
    countryList.style.visibility = 'visible';
    return (countryList.innerHTML = listCountries(result));
  }
  clearInterfaceUI()
  return Notify.info(
    'Too many matches found. Please enter a more specific name.'
  );
}

function clearInterfaceUI() {
    countryList.innerHTML = '';
    countryInfo.innerHTML = '';
  }
  
  function addHidden() {
    countryList.style.visibility = 'hidden';
    countryInfo.style.visibility = 'hidden';
  }