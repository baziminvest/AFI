// AFI research baseline. Signals only. MetaEditor compilation unverified.
#property strict
#property indicator_chart_window
#property indicator_buffers 5
#property indicator_color4 clrMediumSeaGreen
#property indicator_color5 clrIndianRed
input int FastEMA=12;
input int SlowEMA=26;
input int ATRPeriod=14;
input double ScoreThreshold=70;
double Bullish[],Bearish[],Regime[],BuyArrow[],SellArrow[];
int OnInit(){
 SetIndexBuffer(0,Bullish);SetIndexStyle(0,DRAW_NONE);SetIndexLabel(0,"Bullish score");
 SetIndexBuffer(1,Bearish);SetIndexStyle(1,DRAW_NONE);SetIndexLabel(1,"Bearish score");
 SetIndexBuffer(2,Regime);SetIndexStyle(2,DRAW_NONE);SetIndexLabel(2,"Regime: 1 up, -1 down, 0 range");
 SetIndexBuffer(3,BuyArrow);SetIndexStyle(3,DRAW_ARROW);SetIndexArrow(3,233);SetIndexEmptyValue(3,EMPTY_VALUE);
 SetIndexBuffer(4,SellArrow);SetIndexStyle(4,DRAW_ARROW);SetIndexArrow(4,234);SetIndexEmptyValue(4,EMPTY_VALUE);
 ArraySetAsSeries(Bullish,true);ArraySetAsSeries(Bearish,true);ArraySetAsSeries(Regime,true);ArraySetAsSeries(BuyArrow,true);ArraySetAsSeries(SellArrow,true);
 IndicatorShortName("AFI baseline | closed candles | research only");return(INIT_SUCCEEDED);
}
int OnCalculate(const int rates_total,const int prev_calculated,const datetime &time[],const double &open[],const double &high[],const double &low[],const double &close[],const long &tick_volume[],const long &volume[],const int &spread[]){
 ArraySetAsSeries(open,true);ArraySetAsSeries(high,true);ArraySetAsSeries(low,true);ArraySetAsSeries(close,true);
 if(rates_total<SlowEMA+ATRPeriod+2)return(0);
 int limit=prev_calculated==0?rates_total-SlowEMA-ATRPeriod-1:MathMin(rates_total-prev_calculated+1,rates_total-SlowEMA-ATRPeriod-1);
 for(int i=limit;i>=1;i--){
  double fast=iMA(NULL,0,FastEMA,0,MODE_EMA,PRICE_CLOSE,i),slow=iMA(NULL,0,SlowEMA,0,MODE_EMA,PRICE_CLOSE,i),atr=iATR(NULL,0,ATRPeriod,i);
  double rsi=iRSI(NULL,0,14,PRICE_CLOSE,i);double body=close[i]-open[i];
  double score=50;if(atr>0)score+=MathMax(-25,MathMin(25,(fast-slow)/atr*25));score+=(rsi-50)*0.3;if(body>0)score+=5;else if(body<0)score-=5;
  Bullish[i]=MathMax(0,MathMin(100,score));Bearish[i]=100-Bullish[i];Regime[i]=atr>0&&MathAbs(fast-slow)>atr*.25?(fast>slow?1:-1):0;
  BuyArrow[i]=EMPTY_VALUE;SellArrow[i]=EMPTY_VALUE;
  if(Bullish[i]>=ScoreThreshold&&Regime[i]==1)BuyArrow[i]=low[i]-atr*.25;
  if(Bearish[i]>=ScoreThreshold&&Regime[i]==-1)SellArrow[i]=high[i]+atr*.25;
 }
 Bullish[0]=EMPTY_VALUE;Bearish[0]=EMPTY_VALUE;Regime[0]=EMPTY_VALUE;BuyArrow[0]=EMPTY_VALUE;SellArrow[0]=EMPTY_VALUE;
 return(rates_total);
}
