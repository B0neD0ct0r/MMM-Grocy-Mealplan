Module.register("MMM-Grocy", {
  defaults: {
    apiLocation: ""
  },

  async start () {
  
    this.wrapper = document.createElement("div");
    this.wrapper.className = "thin medium grey pre-line";
    this.wrapper.style.color = "red";
    this.recipie_list = "";
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
    return `Grocy Meal Plan`;
  },


  async getGrocyMealPlan () {
   
		let recipieList = [];
    var days = ['Sun','Mon','Tues','Wed','Thrus','Fri','Sat'];
   

    let mealPlan = await fetch(`${this.config.apiLocation}/objects/meal_plan`, {
          
    }).then( r => r.json() );

   
    var pastSunday = await this.getThePastSunday();
    for(var i = 0; i < mealPlan.length; i++){
     
      var day = new Date(mealPlan[i].day);
      
      day.setDate(day.getDate() +1);

      
      
      var endof7Days = new Date();
      endof7Days.setDate(pastSunday.getDate() + 7);
     

      if (day >= pastSunday && day <= endof7Days){
        recipieList.push(await this.getRecepieInfo(mealPlan[i].recipe_id, days[day.getDay()], mealPlan[i].day));
      }

     
    }

  
    //we need to spoool through recipie list after sort to return what we want


    recipieList.sort(function (a,b) {
      if (a[0] > b[0]) return  1;
      if (a[0] < b[0]) return -1;
      if (a[2] < b[2]) return  1;
      if (a[2] > b[2]) return -1;
      return 0;
  });

  

  var correctedList ="";

  for(var i = 0; i < recipieList.length; i++){
    correctedList += `${recipieList[i][2]} - ${recipieList[i][1]}\n`; 
  }

    return correctedList;
  },

  async getThePastSunday(){
    var today = new Date();
    
    today.setDate(today.getDate() - (today.getDay() + 6) % 7);

    today.setDate(today.getDate() - 7);

    var sunday = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 6);

    return sunday;
  },

 

  async getRecepieInfo(recipe_ID,day, date){

    let recipieName = await fetch(`${this.config.apiLocation}/objects/recipes/${recipe_ID}`, {
          
    }).then( r => r.json() );
 
      return [date, recipieName.name, day];
  
  },

  getDom () {
    return this.wrapper;
  },
});
