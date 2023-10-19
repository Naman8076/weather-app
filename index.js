const userTab=document.querySelector('[data-userWeather]')
const searchTab=document.querySelector('[data-searchWeather]');

const userContainer=document.querySelector('.weather-container');

const grantAccessContainer=document.querySelector('.grant-location-container');

const searchForm=document.querySelector('[data-searchForm]');

const loadingScreen=document.querySelector('.loading-container');

const userInfoContainer=document.querySelector(".user-info-container");

// initilly variable
let oldTab=userTab;
// const API_KEY='a62f85ca258a79ae963a33f91f2fa1fb';
const API_KEY ='8bd776b933f8ff7120fc11982fb5fe6b'
oldTab.classList.add("current-tab");
console.log(getfromSessionStorage());

getfromSessionStorage();



// functon for switching
function switchTab(newTab){
    if(newTab!=oldTab){
        
        oldTab.classList.remove('current-tab');
        oldTab=newTab;
        oldTab.classList.add('current-tab');

        if(!searchForm.classList.contains('active')){
            // kya mera search form wala container is invisible,if yes then make it visible
            userInfoContainer.classList.remove('active');
            grantAccessContainer.classList.remove('active');
            searchForm.classList.add('active');
        }
        else{
            // me phle searchwala tba   ne tha ab nme weather wala tab visible krna hai 
            searchForm.classList.remove('active');
            userInfoContainer.classList.remove('active');
            //  ab weather tab me a gya hu to aeather display krna hai to local storag me cordinates check krne ha 
            getfromSessionStorage();
        }
    }

}


userTab.addEventListener('click',()=>{
    // pass click tab as input parameter
    switchTab(userTab)
})
searchTab.addEventListener('click',()=>{
    // pass click tab as input parameter
    switchTab(searchTab)
})



function getfromSessionStorage(){
    const localCoordinates=sessionStorage.getItem('user-coordinates');//yha plbm hai 
    // console.log(localCoordinates);
    if(!localCoordinates){
        grantAccessContainer.classList.add('active');
    }
    else{
        const coordinates=JSON.parse(localCoordinates);
        fetchUserWeatherInfo(coordinates);
    }

}

 async function fetchUserWeatherInfo(coordinates){
    const {lat,lon} =coordinates;
    console.log(lat);
    // make grantcoontaner invisible

    grantAccessContainer.classList.remove('active');
// make loader visible
    loadingScreen.classList.add('active');

    // api call
    try {
        const response=await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${ API_KEY}`);

        const data= await response.json();
        loadingScreen.classList.remove('active');
        userInfoContainer.classList.add('active');
        renderWeatherInfo(data);
    } catch (err) {
        loadingScreen.classList.remove('active');
        // hw
        console.log(err);
        
    }
}

function renderWeatherInfo(weatherInfo){
    // first we have to fetch element
    const cityName=document.querySelector('[data-cityName]');
    const countryIcon=document.querySelector('[data-coutryIcon]');
    const desc=document.querySelector('[data-weatherDesc]')

    const weatherIcon=document.querySelector('[data-weatherIcon]');

    const temp=document.querySelector('[data-temp]');

    const windSpeed=document.querySelector('[data-windspeed]');

    const humidity=document.querySelector('[data-humidity]')
    const cloudiness=document.querySelector('[data-cloudiness]'); 

    // fetch values from api and set to UI
    cityName.innerText=weatherInfo?.name;
    countryIcon.src=`https://flagcdn.com/144x108/${weatherInfo?.sys?.country.toLowerCase()}.png`;
desc.innerText=weatherInfo?.weather?.[0]?.description;
weatherIcon.src=`http://openweathermap.org/img/w/${weatherInfo?.weather?.[0]?.icon}.png`;
temp.innerText=`${weatherInfo?.main?.temp} °C`;
windSpeed.innerText=`${weatherInfo?.wind?.speed} 
m/s `;
humidity.innerText=`${weatherInfo?.main?.humidity}%`;
cloudiness.innerText=`${weatherInfo?.clouds?.all}%`;
    

}

function getLocation(){
    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(showPosition);
    }
    else{
        // hw show an alert no geo location

    }
}
function showPosition(position){
    const userCoordinates={
        lat:position.coords.latitude,
        lon:position.coords.longitude,

    }
    sessionStorage.setItem("user-coordinates",JSON.stringify(userCoordinates));
    fetchUserWeatherInfo(userCoordinates);
}

const grantAccessButton=document.querySelector('[data-grantAccess]');
grantAccessButton.addEventListener('click',getLocation);


const searchInput=document.querySelector('[data-searchInput]');

searchForm.addEventListener("submit",(e)=>{
e.preventDefault();
let cityName=searchInput.value;

if(cityName=="")
    {return}
    else{
        fetchUserWeatherInfo(cityName);
    }
})

 async function fetchUserWeatherInfo(city){
    loadingScreen.classList.add("active");
    userInfoContainer.classList.remove("active");
    grantAccessContainer.classList.remove("active");

    try {
        const response=await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}`);
        

        const data=await response.json();
        loadingScreen.classList.remove('active');
        userInfoContainer.classList.add('active');
        renderWeatherInfo(data);
    } catch (error) {
        //  hw
    }
 }
