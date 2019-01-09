    //   ==========================  Vat Apllication Extension (Vanila JavaScript) ================== 
   //    ==========================  Version 1.0.0             ==================
  //     ==========================   Author: Arslan Ismail    ==================   


  var VatApp=(function(){



  //   ====================   Initializing The Vat App
  var ThemeJsOverRiding={
    _themeProductObserver:function()
    {
        //  Product Price Update Hook 
       
      theme.Product.prototype._updatePrice = function()
             {
                //  Will overrite the theme DOM Manipulation with Custom DOM Manipulation
                //  and Handeling All the possible OutComes
                var taxprice=document.querySelector('#commerce-vat-tax-rate').innerHTML.trim();

        //  Wait for Nano mili Second our DOM Manipulation Runs After the theme Manipulation
          setTimeout(function(){
            var regPriceCondtionExvat=document.getElementsByClassName("price__regular")[0].children[1].children[0].innerHTML.trim();
            
            regPriceCondtionExvat=parseInt(regPriceCondtionExvat.replace(/Exc-Vat Rs./gi,"")) + (parseInt(regPriceCondtionExvat.replace(/Exc-Vat Rs./gi,""))*taxprice);
            if(regPriceCondtionExvat){

                regPriceCondtionExvat=parseFloat(regPriceCondtionExvat).toFixed(2);
                document.querySelector(".price__regular").children[1].children[1].innerHTML='Inc-Vat Rs.'+regPriceCondtionExvat;

            }else{
                var regPriceCondtionExvat=document.getElementsByClassName("price__regular")[0].children[1].children[0].innerHTML.trim();
                regPriceCondtionExvat=parseInt(regPriceCondtionExvat.replace(/Exc-Vat /gi,"")) + (parseInt(regPriceCondtionExvat.replace(/Exc-Vat /gi,""))*taxprice);
                if(regPriceCondtionExvat){
                    document.querySelector(".price__regular").children[1].children[1].innerHTML='Inc-Vat Rs.'+regPriceCondtionExvat;
                }else{
                    var regPriceCondtionExvat=document.getElementsByClassName("price__regular")[0].children[1].children[0].innerHTML.trim();
                regPriceCondtionExvat=parseInt(regPriceCondtionExvat.replace(/Rs./gi,"")) + (parseInt(regPriceCondtionExvat.replace(/Rs./gi,""))*taxprice);
                document.querySelector(".price__regular").children[1].children[1].innerHTML='Inc-Vat Rs.'+regPriceCondtionExvat;
                }
                
            }

            var salePriceCondtionExvat;
            
            if(document.getElementsByClassName("price__sale")[0].children[1].children[0])
            {
            salePriceCondtionExvat=document.getElementsByClassName("price__sale")[0].children[1].children[0].innerHTML.trim();
            salePriceCondtionExvat=parseInt(salePriceCondtionExvat.replace(/Exc-Vat Rs./gi,"")) + (parseInt(salePriceCondtionExvat.replace(/Exc-Vat Rs./gi,""))*taxprice);
            if(salePriceCondtionExvat){
                salePriceCondtionExvat=parseFloat(salePriceCondtionExvat).toFixed(2);
            }else{
                
                var salePriceCondtionExvat=document.getElementsByClassName("price__sale")[0].children[1].children[0].innerHTML.trim();
                
                salePriceCondtionExvat=parseInt(salePriceCondtionExvat.replace(/Rs./gi,"")) + (parseInt(salePriceCondtionExvat.replace(/Rs./gi,""))*taxprice);
                salePriceCondtionExvat=parseFloat(salePriceCondtionExvat).toFixed(2);
            }
            
            
            }
            if(document.querySelector(".price__sale").children[1].children[1])
            {
                document.querySelector(".price__sale").children[1].children[1].innerHTML='Inc-Vat'+salePriceCondtionExvat;
                // document.querySelector(".price__sale").children[1].children[2].innerHTML='';
            }
               }, 50);
              
                
              }
     },

     
     _conditionalRendering:function(){
        
     }    
    }
    
    var ApplicationHtml={
        //    var Select input button html   
        vatSelectInput:function(){
             var selectInput="<select id='vatid' onchange='VatApp.applyPricing()' style='margin-left: 30px;'>"+
             "<option value='exc'>Excl. VAT</option>"+
             "<option value='inc'>Inc. VAT</option>"+
             "<option value='both'>Both</option>"+
             "</select>";

             return selectInput;
         },
         themeHeaderPostion:function(){
            var returnNavInHeader=document.getElementsByTagName("header")[0].children[0].children[2].children[0];
            return returnNavInHeader;
          }, 
         appendVatBtnInHeader:function(){
            var buttonPosition=this.themeHeaderPostion();
            var toAddinHeader=this.vatSelectInput();
            buttonPosition.insertAdjacentHTML('beforeend', toAddinHeader);
         
        },
        runProcess:function(){
             var ele = document.getElementsByClassName('nxb-invat');
             var hideprice=document.getElementsByClassName('nxb-exvat');  
             var saleinvat=document.getElementsByClassName('');
            var selectedVal = document.getElementById("vatid").value;
            if(selectedVal=="inc"){
                
                for (var i = 0; i < hideprice.length; i++ ) {
                    //  ele[i].style.display = "inline";
                     hideprice[i].style.display = "none";
                     try{
                     ele[i].style.display = "inline";
                     }catch(exception){

                     }

                 }
            }
            else if(selectedVal=="exc")
            {
                 for (var i = 0; i < hideprice.length; i++ ) {
                     hideprice[i].style.display = "inline";
                     try{
                        ele[i].style.display = "none";
                        }catch(exception){
                        }
                 }
            }
            else{
                
                for (var i = 0; i < hideprice.length; i++ ) {
                    hideprice[i].style.display = "block";
                    try{
                    ele[i].style.display = "inline";
                    }catch(exception){}

                    //  To Add  Ex - vat infront of the span

                    var toAddExvat=document.getElementsByClassName('nxb-exvat')[i].innerHTML.trim();
                    toAddExvat=toAddExvat.replace(/Rs./gi,"");
                    document.getElementsByClassName('nxb-exvat')[i].innerHTML=''+toAddExvat;
                
                }   
            }
         },
        render:function(){
            this.appendVatBtnInHeader();
         }
        }


        function pricing() {
            ApplicationHtml.runProcess();  
        }

  
      function init(){
        ApplicationHtml.render();
        ThemeJsOverRiding._themeProductObserver();  
      }
  
      return {
          init:init,
          //  Event Handlers  ===> Access with VatApp.pricing();
          applyPricing:pricing
      }
  
  })();
  
  //   ====================   Invoking The Vat App

  VatApp.init();