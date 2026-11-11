<?php
if (!function_exists('id_ios_questions')) {
 function id_ios_questions() {return array(
  'platform'=>array('What platforms are you launching first?',array('iPhone only','iPhone first, Android later','iOS and Android simultaneously')),
  'hardware'=>array('Does your app require Apple-specific hardware?',array('Yes (ARKit, LiDAR, HealthKit, Apple Intelligence)','Maybe one or two standard device features','No, standard cloud features only')),
  'performance'=>array('What are your core performance demands?',array('High performance','Standard consumer UX with smooth scrolling','Content-driven forms or business dashboards')),
  'timeline'=>array('What is your target market launch timeline?',array('6+ months','3 to 6 months','Under 3 months'))
 );}
}
if (!function_exists('id_ios_score')) {
 function id_ios_score($a) {
  $p=$a['platform']; $h=$a['hardware']; $f=$a['performance']; $t=$a['timeline'];
  $n=35; $c=35;
  if ($p==='iPhone only') {$n+=25;$c-=5;} elseif($p==='iPhone first, Android later'){$n+=12;$c+=13;}else{$c+=25;}
  if (strpos($h,'Yes (')===0){$n+=25;$c-=8;}elseif(strpos($h,'Maybe')===0){$n+=8;$c+=4;}else{$c+=18;}
  if ($f==='High performance'){$n+=18;$c-=7;}elseif(strpos($f,'smooth scrolling')!==false){$n+=7;$c+=9;}else{$c+=17;}
  if ($t==='6+ months'){$n+=5;}elseif($t==='3 to 6 months'){$n+=2;$c+=3;}else{$c+=7;}
  $n=max(5,min(99,$n)); $c=max(5,min(99,$c));
  $native=($p==='iPhone only' && (strpos($h,'Yes (')===0 || $f==='High performance')) || ($p==='iPhone only' && strpos($h,'Maybe')===0 && strpos($f,'smooth scrolling')!==false && $t!=='Under 3 months');
  $cross=($p==='iOS and Android simultaneously' && $h==='No, standard cloud features only' && $f!=='High performance');
  $kind=$native?'native':($cross?'cross':'review');
  $texts=array(
    'native'=>array('Native iOS Development Is Your Stronger Starting Point','Your Apple integration and performance priorities make native iOS worth assessing first. Swift and SwiftUI provide direct access to the capabilities your product may require.'),
    'cross'=>array('Cross-Platform Development Is Worth Prioritizing','Your platform plans and feature requirements suggest Flutter or React Native could support shared development. Platform-specific integrations still require review.'),
    'review'=>array('Your App Needs a Closer Architecture Review','Your answers contain competing requirements. A short questionnaire cannot settle the choice between native iOS and cross-platform development.')
  );
  $reasons=array('Launch: '.$p,'Apple capabilities: '.$h,'Performance: '.$f,'Timeline: '.$t);
  return array('kind'=>$kind,'title'=>$texts[$kind][0],'body'=>$texts[$kind][1], 'native'=>$n,'cross'=>$c,'reasons'=>$reasons);
 }
}
