// Optional EA bridge. No orders. Not used by the offline indicator or Strategy Tester.
#property strict
input string HealthURL="";
int OnInit(){EventSetTimer(60);return(INIT_SUCCEEDED);}
void OnDeinit(const int reason){EventKillTimer();}
void OnTimer(){
 if(IsTesting() || StringLen(HealthURL)==0)return;
 char data[],result[];string responseHeaders;
 int status=WebRequest("GET",HealthURL,"",5000,data,result,responseHeaders);
 if(status<0)Print("AFI read-only health check unavailable. Review the terminal URL allow-list.");
 else Print("AFI health response status: ",status);
}
void OnTick(){} // Intentionally no OrderSend, OrderModify or OrderClose.
