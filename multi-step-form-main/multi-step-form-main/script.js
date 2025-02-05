const sidebarStep = document.querySelectorAll('.circle_num');
const formStep = document.querySelectorAll('.step');
const form = document.getElementById('form');
const planCards = document.querySelectorAll('.plan_Card');
const addsonCards = document.querySelectorAll('.addonCard');
const changePlanBtn = document.getElementById('change-plan');
let selectedPlan = {};

const saveToLocalStorage = (key, data) => {
    localStorage.setItem(key, JSON.stringify(data));
};

const selectedAddsOn = () => {
    let addOnArr = [];
    addsonCards.forEach((card) => {
        let price = card.querySelector('.subscription_price').textContent;
        let name = card.querySelector('.card_name').textContent;
        let planDur = card.querySelector('.sbscription__duration').textContent;
        if (card.classList.contains('selected')) {
            addOnArr.push({
                price,
                name,
                planDur,
            });
        }
    });
    return addOnArr;
};

const monthlyPlanPrices = [9, 12, 15];
const yearlyPlanPrices = [90, 120, 150];
const monthlyAdsOnPrice = [1, 2, 2];
const yearlyAdsOnPrice = [10, 20, 20];

const setplan = (card, price, duration) => {
    card.forEach((card, i) => {
        const priceElement = card.querySelector('.subscription_price');
        const durationElement = card.querySelector('.sbscription__duration');
        if (priceElement && durationElement) {
            priceElement.textContent = `${price[i]}`;
            durationElement.textContent = `${duration}`;
        }
    });
};

setplan(planCards, monthlyPlanPrices, 'mo');
setplan(addsonCards, monthlyAdsOnPrice, 'mo');

const nextBtn = document.getElementById('next-button');
const prevBtn = document.getElementById('prev-button');

const selectPlanError = (text) => {
    const errorElement = document.getElementById('select-plan-error');
    if (errorElement) {
        errorElement.textContent = text;
    }
};

let stepNum = 0;

nextBtn.addEventListener('click', (e) => {
    e.preventDefault();
    if(stepNum==4){
        stepNum=0;
    }
    if (stepNum == 0) {
        let ans = formValidation();
        // console.log(ans)
        if (ans == false) {
            return;
        }

        // if (!formValidation()) return;
        stepNum++;
        localStorage.setItem('stepNum', stepNum);
        // console.log(stepNum);
        showStep(stepNum);
    } else if (stepNum === 1) {
        if (Object.entries(selectedPlan).length === 0) {
            return selectPlanError('Please select a plan');
        }
        stepNum++;
       
        // console.log(stepNum);
        localStorage.setItem('stepNum', stepNum);
        showStep(stepNum);
    } else if (stepNum === 2) {
        displayTotal();
        stepNum++;
       
        // console.log(stepNum);
        localStorage.setItem('stepNum', stepNum);
        showStep(stepNum);
    } else if (stepNum === 3) {
        stepNum++;
      
        // console.log(stepNum);
        localStorage.setItem('stepNum', stepNum);
        showStep(stepNum);
    } else return;
});
// console.log(stepNum);

prevBtn.addEventListener('click', (e) => {
    e.preventDefault();
    // console.log(stepNum);
    stepNum--;
    localStorage.setItem('stepNum', stepNum);
    return showStep(stepNum);
});

const showStep = (x) => {
    selectPlanError('');

    if (x < sidebarStep.length) {
        sidebarStep.forEach((step) => step.classList.remove('active'));
        sidebarStep[x].classList.add('active');
    }
    if (x < formStep.length) {
        if (x === 0) {
            prevBtn.classList.add('hidden');
            prevBtn.setAttribute('disabled', '');
        } else if (x === 4) {
            nextBtn.parentElement.classList.add('hidden');
        } else {
            prevBtn.classList.remove('hidden');
            prevBtn.removeAttribute('disabled');
        }
        x === 3
            ? (nextBtn.textContent = 'Confirm')
            : (nextBtn.textContent = 'Next step');

        formStep.forEach((step) => step.classList.remove('active'));
        formStep[x].classList.add('active');
    }
};
showStep(stepNum);
// console.log(stepNum);

const showError = (input, errorText) => {
    input.classList.add('error');
    const errorElement = input.parentElement.querySelector('.error');
    if (errorElement) {
        errorElement.textContent = errorText;
    }
};

const hideError = (input) => {
    input.classList.remove('error');
    const errorElement = input.parentElement.querySelector('.error');
    if (errorElement) {
        errorElement.textContent = '';
    }
};

const formInput = form.querySelectorAll('input');
const formValidation = () => {
    let flag = true;
    formInput.forEach((input) => {

        if (input.name === 'userName') {
            let myNameRegex = /^[a-zA-Z-\s]+$/;
            // console.log(input.value);

            if (input.value.trim() == "") {
                showError(input, 'This field is required');
                flag = false;
            } else if (myNameRegex.test(input.value) === false) {
                showError(input, 'Cannot contain number or symbols')
                flag = false;
            } else if (input.value.trim() !== "") {
                hideError(input)
            }
        }
        if (input.name === 'email') {
            let myMailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

            if (input.value.trim() == "") {
                showError(input, 'This field is required')
                flag = false;
            } else if (myMailRegex.test(input.value) === false) {
                showError(input, 'Enter valid email')
                flag = false;
            } else {
                hideError(input);
            }
        }
        if (input.name === 'phone') {
            let numRegex = /^[0-9\s]+$/;
            // let numRegex=/^(\+\d{1,3}[- ]?)?\d{10}$/
            if (input.value.trim() == "") {
                showError(input, 'This field is required')
                flag = false;
            } else if (numRegex.test(input.value) === false) {
                showError(input, 'Must contain numbers')
                flag = false;
            } else {
                hideError(input);
            }

        }
    });
    return flag;
};

const toggle = document.getElementById('toggle');
const yearlyBenefit = document.querySelectorAll('.yearly_benefit');
const month = document.getElementById('monthly');
const year = document.getElementById('yearly');

toggle.addEventListener('click', (e) => {
    selectPlanError('');
    const toggle = e.target.parentElement;
    planCards.forEach((card) => card.classList.remove('selected'));
    selectedPlan = {};

    toggle.classList.toggle('active');

    if (toggle.classList.contains('active')) {
        yearlyBenefit.forEach((item) => item.classList.add('show'));
        setplan(planCards, yearlyPlanPrices, 'yr');
        setplan(addsonCards, yearlyAdsOnPrice, 'yr');
        year.classList.add('selected_plan');
        month.classList.remove('selected_plan');
    } else {
        setplan(planCards, monthlyPlanPrices, 'mo');
        setplan(addsonCards, monthlyAdsOnPrice, 'mo');
        yearlyBenefit.forEach((item) => item.classList.remove('show'));
        month.classList.add('selected_plan');
        year.classList.remove('selected_plan');
    }
});

planCards.forEach((card) => {
    card.addEventListener('click', (e) => {
        selectPlanError('');
        let target = e.currentTarget;
        planCards.forEach((card) => card.classList.remove('selected'));
        target.classList.add('selected');

        let planName = target.querySelector('.card_name').textContent;
        let planPrice = target.querySelector('.subscription_price').textContent;
        let planDur = target.querySelector('.sbscription__duration').textContent;

        selectedPlan = { planName, planPrice, planDur };
    });
});

addsonCards.forEach((card) => {
    card.addEventListener('click', (e) => {
        let target = e.currentTarget;
        let checkbox = target.querySelector('.checkbox');
        target.classList.toggle('selected');

        checkbox.checked = target.classList.contains('selected');
    });
});

const displayTotal = () => {
    let totalAmount = 0;
    const planDuration = selectedPlan.planDur === 'mo' ? 'Monthly' : 'Yearly';
    const plan = document.getElementById('selected-plan');
    const addsOnList = document.getElementById('selected-addon');
    const total = document.getElementById('total');

    plan.replaceChildren();
    addsOnList.replaceChildren();
    total.replaceChildren();

    const planName = document.createElement('p');
    planName.textContent = selectedPlan.planName;

    const dur = document.createElement('p');
    dur.textContent = `(${planDuration})`;

    const planPrice = document.createElement('p');
    planPrice.textContent = `$${selectedPlan.planPrice}/${selectedPlan.planDur}`;

    plan.append(planName, dur, planPrice);

    totalAmount += parseInt(selectedPlan.planPrice, 10);

    selectedAddsOn().forEach((item) => {
        const listItem = document.createElement('li');

        const addOnName = document.createElement('p');
        addOnName.textContent = item.name;

        const addOnPrice = document.createElement('p');
        addOnPrice.textContent = `+$${item.price}/${item.planDur}`;

        listItem.append(addOnName, addOnPrice);
        addsOnList.appendChild(listItem);

        totalAmount += parseInt(item.price, 10);
    });

    const totalText = document.createElement('span');
    totalText.textContent = `Total (per ${planDuration.slice(0, -2).toLowerCase()})`;

    const totalPrice = document.createElement('span');
    totalPrice.textContent = `$${totalAmount}/${selectedPlan.planDur}`;

    total.append(totalText, totalPrice);
};

changePlanBtn.addEventListener('click', () => {
    stepNum = 1;
    showStep(stepNum);
});

const getFromLocalStorage = (key) => {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
};

const loadSavedData = () => {
    const savedStepNum = getFromLocalStorage('stepNum');
    if (savedStepNum !== null) {
        stepNum = savedStepNum;
    }
    
    const savedPersonalInfo = getFromLocalStorage('personalInfo');
    const savedSelectedPlan = getFromLocalStorage('selectedPlan');
    const savedAddOns = getFromLocalStorage('selectedAddOns');

    if (stepNum===0) {
        form.querySelectorAll('input').forEach((input) => {
            input.value = savedPersonalInfo[input.name] || '';
        });
        showStep(stepNum);
    }

    if (stepNum===1) {
        selectedPlan = savedSelectedPlan;
        planCards.forEach((card) => {
            const planName = card.querySelector('.card_name').textContent;
            if (planName === savedSelectedPlan.planName) {
                card.classList.add('selected');
            }
        });
        showStep(stepNum);
    }

    if (stepNum===2) {
        savedAddOns.forEach((addOn) => {
            addsonCards.forEach((card) => {
                const addOnName = card.querySelector('.card_name').textContent;
                if (addOnName === addOn.name) {
                    card.classList.add('selected');
                    card.querySelector('.checkbox').checked = true;
                }
            });
        });
        showStep(stepNum);

    }
    if(stepNum>4){
        stepNum=0;
    }
};

// const loadSavedData = () => {
//     const savedStepNum = getFromLocalStorage('stepNum');
//     if (savedStepNum !== null) {
//         stepNum = savedStepNum;
//     }
    
//     const savedPersonalInfo = getFromLocalStorage('personalInfo');
//     const savedSelectedPlan = getFromLocalStorage('selectedPlan');
//     const savedAddOns = getFromLocalStorage('selectedAddOns');

//     if (stepNum === 0) {
//         form.querySelectorAll('input').forEach((input) => {
//             input.value = savedPersonalInfo[input.name] || '';
//         });
//         showStep(stepNum);
//     }

//     if (stepNum === 1) {
//         selectedPlan = savedSelectedPlan;
//         planCards.forEach((card) => {
//             const planName = card.querySelector('.card_name').textContent;
//             if (planName === savedSelectedPlan.planName) {
//                 card.classList.add('selected');
//             }
//         });
//         showStep(stepNum);
//     }

//     if (stepNum === 2) {
//         savedAddOns.forEach((addOn) => {
//             addsonCards.forEach((card) => {
//                 const addOnName = card.querySelector('.card_name').textContent;
//                 if (addOnName === addOn.name) {
//                     card.classList.add('selected');
//                     card.querySelector('.checkbox').checked = true;
//                 }
//             });
//         });
//         showStep(stepNum);
//     }
// };

// loadSavedData(); 

form.querySelectorAll('input').forEach((input) => {
    input.addEventListener('input', () => {
        const formData = {};
        form.querySelectorAll('input').forEach((input) => {
            formData[input.name] = input.value;
        });
        saveToLocalStorage('personalInfo', formData);
    });
});

planCards.forEach((card) => {
    card.addEventListener('click', () => {
        saveToLocalStorage('selectedPlan', selectedPlan);
    });
});

addsonCards.forEach((card) => {
    card.addEventListener('click', () => {
        saveToLocalStorage('selectedAddOns', selectedAddsOn());
    });
});

changePlanBtn.addEventListener('click', () => {
    localStorage.removeItem('personalInfo');
    localStorage.removeItem('selectedPlan');
    localStorage.removeItem('selectedAddOns');
});

loadSavedData();

                                                                        