var vatApp=(function(){

    var ThemeJsOverRiding={

        _themeProductObserver:function()
        {
            theme.Product.prototype._updatePrice = function(){
            var taxprice=$('#commerce-vat-tax-rate').text().trim();
            var storeCurrency=$('#commerce-vat-store-currency').html();

        //  Wait for Nano mili Second our DOM Manipulation Runs After the theme Manipulation
          setTimeout(function()
          {
            var regPriceCondtionExvat=$.trim($('.price__regular .nxb-exvat').html());
            
            regPriceCondtionExvat=parseInt(regPriceCondtionExvat.replace(/Exc-Vat Rs./gi,"")) + (parseInt(regPriceCondtionExvat.replace(/Exc-Vat Rs./gi,""))*taxprice);
            if(regPriceCondtionExvat){
                regPriceCondtionExvat=parseFloat(regPriceCondtionExvat).toFixed(2);
                $('.price__regular .nxb-invat').empty().append('Inc-Vat '+storeCurrency+''+regPriceCondtionExvat);
            }
            else
            {
                var regPriceCondtionExvat=$.trim($('.price__regular .nxb-exvat').html());
                regPriceCondtionExvat=parseInt(regPriceCondtionExvat.replace(/Exc-Vat /gi,"")) + (parseInt(regPriceCondtionExvat.replace(/Exc-Vat /gi,""))*taxprice);
                if(regPriceCondtionExvat){
                    $('.price__regular .nxb-invat').empty().append('Inc-Vat Rs.'+regPriceCondtionExvat);
                }else{
                var regPriceCondtionExvat=$.trim($('.price__regular .nxb-exvat.price-item.price-item--regular').html());
                regPriceCondtionExvat=parseInt(regPriceCondtionExvat.replace(/Rs./gi,"")) + (parseInt(regPriceCondtionExvat.replace(/Rs./gi,""))*taxprice);
                $('.price__regular .nxb-invat').empty().append('Inc-Vat '+storeCurrency+''+regPriceCondtionExvat);
                }
            }
            
            if($(".price__sale").length)
            {
            var salePriceCondtionExvat=$.trim($(".price__sale .nxb-exvat").html());
            salePriceCondtionExvat=parseInt(salePriceCondtionExvat.replace(/Exc-Vat Rs./gi,"")) + (parseInt(salePriceCondtionExvat.replace(/Exc-Vat Rs./gi,""))*taxprice);
            if(salePriceCondtionExvat){
                salePriceCondtionExvat=parseFloat(salePriceCondtionExvat).toFixed(2);
                $(".price__sale .nxb-invat").empty().append('Inc-Vat '+salePriceCondtionExvat);
            }else
            {
                var salePriceCondtionExvat=$.trim($(".price__sale .nxb-exvat").html());
                salePriceCondtionExvat=parseInt(salePriceCondtionExvat.replace(/Exc-Vat /gi,"")) + (parseInt(salePriceCondtionExvat.replace(/Exc-Vat /gi,""))*taxprice);
                salePriceCondtionExvat=parseFloat(salePriceCondtionExvat).toFixed(2);
                
                if(!isNaN(salePriceCondtionExvat))
                {
                    
                $(".price__sale .nxb-invat").empty().append('Inc-Vat '+salePriceCondtionExvat);
                }
                else
                {
                    var salePriceCondtionExvat=$.trim($(".price__sale .nxb-exvat").html());
                    salePriceCondtionExvat=parseInt(salePriceCondtionExvat.replace(/Rs./gi,"")) + (parseInt(salePriceCondtionExvat.replace(/Rs./gi,""))*taxprice);
                    salePriceCondtionExvat=parseFloat(salePriceCondtionExvat).toFixed(2);
                    $(".price__sale .nxb-invat").empty().append('Inc-Vat '+salePriceCondtionExvat);
                }    
            }
            }
               }, 50);
               
            }
        }
    }



    var ApplicationHtml=
    {
        vatSelectInput:function(){
            var selectInput="<select id='vatid' onchange='vatApp.applyPricing()' style='margin-left: 30px;'>"+
            "<option value='exc'>Excl. VAT</option>"+
            "<option value='inc'>Inc. VAT</option>"+
            "<option value='both'>Both</option>"+
            "</select>";            
            return selectInput;
        },
        themeHeaderPostion:function()
        {
            var returnNavInHeader=$("header").find('.site-header__icons-wrapper');
            return returnNavInHeader;
        },
        appendVatBtnInHeader:function(){
            var AppendHtml=this.themeHeaderPostion();
            var toAddinHeader=this.vatSelectInput();
            AppendHtml.append(toAddinHeader);
        },
        runProcess:function()
        {
            var ele =$('.nxb-invat');
            var hideprice=$('.nxb-exvat');  
            var selectedVal=$("#vatid").val();
           if(selectedVal=="inc"){
               $.each(hideprice,function(index){
                   
                   hideprice[index].style.display = "none";
                   try{
                   ele[index].style.display = "block";
                   }catch(exception){
                   }
               });
           }
           else if(selectedVal=="exc")
           {
            $.each(hideprice,function(index){
                hideprice[index].style.display = "block";
                try{
                   ele[index].style.display = "none";
                   }catch(exception){
                   }
            });

           }
           else{
            $.each(hideprice,function(index){
                hideprice[index].style.display = "block";
                try{
                ele[index].style.display = "inline";
                }catch(exception){}
                //  To Add  Ex - vat infront of the span
                var toAddExvat=$('.nxb-exvat')[index].innerHTML.trim();
                toAddExvat=toAddExvat.replace(/Rs./gi,"");
                $('.nxb-exvat')[index].innerHTML=''+toAddExvat;
            });
           }
        },
        render:function(){
            this.appendVatBtnInHeader();
         }
    }
    function init(){
        ApplicationHtml.render();
        ThemeJsOverRiding._themeProductObserver();  
    }
    function pricing(){
        ApplicationHtml.runProcess();  
    }
    return {
        init:init,
        //  Event Handlers  ===> Access with VatApp.pricing();
        applyPricing:pricing
    }
})();


$(document ).ready(function() {
  vatApp.init();
});