Module.register("MMM-Grocy", {
  defaults: {
    apiLocation: "",
    apiKey: "",
    headerName: "Grocy Meal Plan",
    textColor: "red",
    numOfDays: 7,
    rollingDays: "yes",
  },

  getStyles: function () {
    return ["MMM-Grocy.css"];
  },

  getHeader () {
    return `${this.config.headerName}`;
  },

  async getGrocyMealPlan () {

    let recipeList = [];
    var days = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];

    var startDay = this.formatDay(this.setStartDay());
    var endDay = this.formatDay(this.setEndDay());

    let url = `${this.config.apiLocation}/objects/meal_plan?query[]=day>=${startDay}&query[]=day<=${endDay}`;

    let mealPlan = await fetch(url, {
        method: 'GET',
        headers: {
            'GROCY-API-KEY': `${this.config.apiKey}`,
            'Content-Type': 'application/json'
        }
    }).then( r => r.json() );


    var pastSunday = await this.getThePastSunday();
    var today = new Date()
    var tomorrow = new Date(today)
    tomorrow.setDate(today.getDate() + 1)
    for(var i = 0; i < mealPlan.length; i++){

      var day = new Date(mealPlan[i].day);

      day.setDate(day.getDate());

      const endof7Days = new Date(pastSunday);
      endof7Days.setDate(endof7Days.getDate() + 7);


      if (day >= pastSunday && day <= endof7Days){
        var recipeDay = days[day.getDay()]
        if (day.getDay() === today.getDay()){
          recipeDay = "Today";
        }
        else if (day.getDay() === tomorrow.getDay()){
          recipeDay = "Tomorrow";
        }

        recipeList.push([mealPlan[i].day, await this.getRecipeInfo(mealPlan[i].recipe_id), recipeDay]);
      }


    }


    //we need to spool through recipe list after sort to return what we want


    recipeList.sort(function (a,b) {
      if (a[0] > b[0]) return  1;
      if (a[0] < b[0]) return -1;
      if (a[2] < b[2]) return  1;
      if (a[2] > b[2]) return -1;
      return 0;
  });

    // Group recipes by day to handle days with more than one recipe
    const groupedRecipes = recipeList.reduce((acc, [date, name, day]) => {
        if (!acc[day]) {
            acc[day] = [];
        }
        acc[day].push(name);
        return acc;
    }, {});


    // Format the grouped recipes
    let formattedList = "";
    for (const [day, recipes] of Object.entries(groupedRecipes)) {
        formattedList += `<div class="day-header">${day}</div>`;
        for (let i = 0; i < recipes.length; i++) {
            formattedList += `<div class="recipe">${recipes[i]}</div>`;
        }
    }

    return formattedList;
  },

  getThePastSunday() {
    const lastSunday = new Date();

    const daysSinceSunday = lastSunday.getDay(); // Day integer, sun = 0, mon = 1, etc
    lastSunday.setDate(lastSunday.getDate() - daysSinceSunday);

    return lastSunday
  },

  getToday() {
    var today = new Date();

    return today
  },

  setStartDay() {
    let startDay = this.getThePastSunday();

    if (this.config.rollingDays === "yes") {
      startDay = this.getToday();
    }

    return startDay
  },

  setEndDay() {
    let endDay = new Date();
    endDay.setDate(endDay.getDate() + (this.config.numOfDays - 1));

    return endDay
  },

  formatDay(day) {
    // Extract year, month, and day
    var year = day.getFullYear();
    var month = String(day.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
    var day = String(day.getDate()).padStart(2, '0');

    // Format as YYYY-MM-DD
    var formattedDate = `${year}-${month}-${day}`;

    return formattedDate;
  },

  async getRecipeInfo(recipe_ID){

    let recipeName = await fetch(`${this.config.apiLocation}/objects/recipes/${recipe_ID}`, {
        method: 'GET',
        headers: {
            'GROCY-API-KEY': `${this.config.apiKey}`,
            'Content-Type': 'application/json'
            }
    }).then( r => r.json() );

      return recipeName.name;

  },

  getDom () {
    return this.wrapper;
  },

  async start () {

    this.wrapper = document.createElement("div");
    this.wrapper.className = "pre-line";
    this.wrapper.style.color = this.config.textColor;
    this.recipe_list = "";
    var txtContainer = document.createElement("div");
    txtContainer.className = "grocy-content";

    txtContainer.innerHTML = await this.getGrocyMealPlan();


    this.wrapper.appendChild(txtContainer);

    setInterval(async () => {
      txtContainer.innerHTML = await this.getGrocyMealPlan();
      this.wrapper.appendChild(txtContainer);
         this.updateDom();
       }, 60000);


    return this.wrapper;

  },
});