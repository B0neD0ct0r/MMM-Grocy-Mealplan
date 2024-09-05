Module.register("MMM-Grocy", {
  defaults: {
    apiLocation: "",
    apiKey: "",
    headerName: "Grocy Meal Plan",
    textColor: "red"
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

  getStyles: function () {
    return ["MMM-Grocy.css"];
  },

  getHeader () {
    return `${this.config.headerName}`;
  },


  async getGrocyMealPlan () {

                let recipeList = [];
    var days = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];


    let mealPlan = await fetch(`${this.config.apiLocation}/objects/meal_plan`, {
        method: 'GET',
        headers: {
            'GROCY-API-KEY': `${this.config.apiKey}`,
            'Content-Type': 'application/json'
        }
    }).then( r => r.json() );


    var pastSunday = await this.getThePastSunday();
    for(var i = 0; i < mealPlan.length; i++){

      var day = new Date(mealPlan[i].day);

      day.setDate(day.getDate() +1);



      var endof7Days = new Date(Date.now());
      endof7Days.setDate(pastSunday.getDate() + 7);


      if (day >= pastSunday && day <= endof7Days){
        recipeList.push(await this.getRecipeInfo(mealPlan[i].recipe_id, days[day.getDay()], mealPlan[i].day));
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

    // Group recipes by day to handle days with mire than one recipe
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

  async getThePastSunday(){
    var today = new Date(Date.now());

    today.setDate(today.getDate() - (today.getDay() + 6) % 7);

    today.setDate(today.getDate() - 7);

    var sunday = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 6);

    return sunday;
  },



  async getRecipeInfo(recipe_ID,day, date){

    let recipeName = await fetch(`${this.config.apiLocation}/objects/recipes/${recipe_ID}`, {
        method: 'GET',
        headers: {
            'GROCY-API-KEY': `${this.config.apiKey}`,
            'Content-Type': 'application/json'
            }
    }).then( r => r.json() );

      return [date, recipeName.name, day];

  },

  getDom () {
    return this.wrapper;
  },
});