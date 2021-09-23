var js_call_lastdll = function () {
  var iconv = require('iconv-lite');
  const path = require('path');
  var ffi = require('ffi');
  const ref = require('ref');
  const Struct = require('ref-struct');
  const refArray = require('ref-array');

  var mutiArray = refArray(refArray(ref.types.short));
  var StringArray = refArray('char');
  var ShortArray = refArray('short');
  var Dishinarr;
  const ECG_PARAMETER_T = Struct({
    hr: ref.types.short,
    prInterval: ref.types.short,
    pDur: ref.types.short,
    qrsDur: ref.types.short,
    QT: ref.types.short,
    QTc_B: ref.types.short,
    QTc_F: ref.types.short,
    aveRrInterval: ref.types.short,
    RV5: ref.types.short,
    SV1: ref.types.short,
    SV5: ref.types.short,
    RV1: ref.types.short,
    P_Axis: ref.types.short,
    R_Axis: ref.types.short,
    T_Axis: ref.types.short,
    ar: ref.types.short,
    avePpInterval: ref.types.short
  });

  const ECG_ANALYSE_RES_T = Struct({
    ecgParamRes: ECG_PARAMETER_T,
    ecgDiagRes: refArray('char *')
  });

  const QRS_AMP_T = Struct({
    Q_Amp: ref.types.short,
    R_Amp: ref.types.short,
    S_Amp: ref.types.short
  });

  const ST_T = Struct({
    st_vol: ref.types.short,
    st_type: ref.types.short
  });

  const P_WAVE_T = Struct({
    P_OnSet: ref.types.int,
    P_OffSet: ref.types.int,
    P_Set: ref.types.int,
    P_Dur: ref.types.int,
    P_Dir: ref.types.short,
    P_Amp: ref.types.short,
    P_Axis: ref.types.short
  });
  const T_WAVE_T = Struct({
    T_OffSet: ref.types.int,
    T_Set: ref.types.int,
    T_Dir: ref.types.short,
    T_Amp: refArray(ref.types.short, 12),
    T_Axis: ref.types.short
  });
  const QRS_WAVE_T = Struct({
    Q_OnSet: ref.types.int,
    Q_OffSet: ref.types.int,
    qrsDur: ref.types.short,
    qDur: refArray(ref.types.short, 12),
    R_Axis: ref.types.short,
    qrsAmp: refArray(QRS_AMP_T, 12),
    QRS_MainPeakAmp_40: refArray(ref.types.short, 12),
    QRS_MainPeakAngle: refArray(ref.types.short, 12),
    QRS_Amp_Ratio_Pos_Neg: refArray(ref.types.float, 12),
    atrPaceOnset: ref.types.int,
    ventPaceOnset: ref.types.int
  });
  const ECG_BEAT_T = Struct({
    ecgBeatSet: ref.types.int,
    rrInterval: ref.types.int,
    prInterval: ref.types.short,
    hr: ref.types.short,
    QT: ref.types.short,
    ppInterval: ref.types.short,
    ar: ref.types.short,
    baseLineVal: refArray(ref.types.short, 12),
    st: refArray(ST_T, 12),
    qrsWave: QRS_WAVE_T,
    pWave: P_WAVE_T,
    tWave: T_WAVE_T,
    beatType: ref.types.short,
    diagCode: ref.types.short
  });
  var ECG_BEAT_T_ArrType = refArray(ECG_BEAT_T);


  const Class = Struct({  // 注意返回的`Class`是一个类型
    age: ref.types.short,
    gender: ref.types.short
  });
  //console.log(path.join(__dirname, '../native/last.dll'));

  var last_path;
  if (__dirname.includes('.asar')) {
    last_path = path.join(process.resourcesPath, '/native/last_new.dll');
  } else {
    last_path = path.join(__dirname, '../native/last_new.dll');
  }
  console.log(last_path);

  var ecg = ffi.Library(last_path, {
    'initEcgAnalyse': [ref.types.bool, [ref.types.short, ref.types.short, Class, ref.types.int]],
    'ecgAnalyse': [ref.types.bool, [mutiArray, 'int', ref.types.bool, 'string', ref.refType('short')]],
    'getEcgAnalyRes': ['void', [ref.refType(ECG_ANALYSE_RES_T)]],
    'getEcgAnalyResText': ['void', [ref.refType('char')]],
    'getEcgBeatRes': [ref.types.short, [ECG_BEAT_T_ArrType, ref.types.short]]
  });
  const grade3 = new Class();
  var infoRef = new Buffer(512);
  infoRef.type = ref.types.char;
  //var sxxx = ref.alloc(StringArray,100);
  var liv_info = new ECG_ANALYSE_RES_T();
  var DishInfoArr = ECG_BEAT_T_ArrType(50);
  var count = ref.alloc('short');
  var ecg_gettext = function (data, arrlen) {
    grade3.age = 25;
    grade3.gender = 2;
    ecg.initEcgAnalyse(500, 13, grade3, data[0].length / 500 * 250);
    // console.log(ecg.initEcgAnalyse(500, 13, grade3));
    const cName = new mutiArray(data);
    ecg.ecgAnalyse(cName, arrlen, true, 'GrAyH%0YHJ0y*%Ay*&UzHbU0*Y==', count);
    // console.log(ecg.ecgAnalyse(cName, 5000, true,'GrAyH%0YHJ0y*%Ay*&UzHbU0*Y==',count));
    ecg.getEcgAnalyRes(liv_info.ref());
    ecg.getEcgAnalyResText(infoRef);
    var as_data = iconv.decode(infoRef, 'GBK');//解码成utf8.
    as_data = as_data.split(',');
    //		console.log(as_data);

    //              console.log('-------------------------------');
    var num = ecg.getEcgBeatRes(DishInfoArr, 50);//调用
    //              Dishinarr=DishInfoArr;
    //		//debugger;
    // console.log(Dishinarr,speed,ec_stat);
    return {
      'res_asdata': as_data,
      'Disharr': DishInfoArr
    };
  };
  return {
    ecg_gettext: ecg_gettext
  };
};
var js_call_handdll = function () {
  var iconv = require('iconv-lite');
  const path = require('path');
  var ffi = require('ffi');
  const ref = require('ref');
  const Struct = require('ref-struct');
  const refArray = require('ref-array');
  var mutiArray = refArray(refArray(ref.types.short));
  var StringArray = refArray('char');
  var ShortArray = refArray('short');
  const P_QRS_T_MANUAL_PARA = Struct({
    P1: ref.types.int,
    P2: ref.types.int,
    Q1: ref.types.int,
    Q2: ref.types.int,
    T1: ref.types.int,
    T2: ref.types.int
  });
  const ECG_PARAMETER_T_MANUAL = Struct({
    pDur: ref.types.short,
    qrsDur: ref.types.short,
    tDur: ref.types.short,
    prInterval: ref.types.short,
    QT: ref.types.short,
    QTc_B: ref.types.short,
    QTc_F: ref.types.short,
    P_Axis: ref.types.short,
    R_Axis: ref.types.short,
    T_Axis: ref.types.short,
    baseLineVal: refArray(ref.types.short, 12),
    Q_Amp: refArray(ref.types.short, 12),
    R_Amp: refArray(ref.types.short, 12),
    S_Amp: refArray(ref.types.short, 12),
    P_Amp: refArray(ref.types.short, 12),
    T_Amp: refArray(ref.types.short, 12),
    RV5: ref.types.short,
    SV1: ref.types.short
  });

  var hand_path;
  if (__dirname.includes('.asar')) {
    hand_path = path.join(process.resourcesPath, '/native/hand_new.dll');
  } else {
    hand_path = path.join(__dirname, '../native/hand_new.dll');
  }
  console.log(hand_path);
  var ecg_hand = ffi.Library(hand_path, {
    'ecgManualAnalyse': [ref.types.bool, [mutiArray, ref.types.int, ref.refType(P_QRS_T_MANUAL_PARA), ref.types.short, ref.refType(ECG_PARAMETER_T_MANUAL), 'string', ref.refType('short')]]
  });
  var count = ref.alloc('short');

  var ecghd_gtxt = function (data, obj, arrleng) {
    const hand_struct = new P_QRS_T_MANUAL_PARA();
    hand_struct.P1 = obj['p1'];
    hand_struct.P2 = obj['p2'];
    hand_struct.Q1 = obj['q1'];
    hand_struct.Q2 = obj['q2'];
    hand_struct.T1 = obj['t1'];
    hand_struct.T2 = obj['t2'];
    var v3h = new ECG_PARAMETER_T_MANUAL();
    const cName = new mutiArray(data);
    ecg_hand.ecgManualAnalyse(cName, arrleng, hand_struct.ref(), resvrr, v3h.ref(), 'GrAyH%0YHJ0y*%Ay*&UzHbU0*Y==', count);
    return v3h;
  };
  return {
    ecghd_gtxt: ecghd_gtxt
  };
};

function selec_number (data) {
  //data数组中的值不能超出short的范围-32768~32767
  var dggharr = [];
  dggharr.length = 0;
  for (let k = 0; k < data.length; k++) {
    var tempparent = data[k];
    dggharr[k] = [];
    var temdg_arr = dggharr[k];
    for (let j = 0; j < tempparent.length; j++) {
      var tempchil = tempparent[j];
      if (tempchil <= (-32768)) {
        //				console.log(tempchil);
        //				console.log(tempparent);
        temdg_arr.push(-32767);
      } else if ((tempchil >= 32768)) {
        temdg_arr.push(32767);
      } else {
        temdg_arr.push(tempchil);
      }
    }
  }
  ;
  return dggharr;
}

function ecg_getlastst (usespointer, data, resvrr, ec_index) {
  console.log(ec_index); //心拍索引
  var ddata = selec_number(data);
  var arrlen = (ddata[0]).length;
  console.log(arrlen);
  if (ddata.length != 13) {
    console.log('请注意,数据长度不为13，可能会导致程序异常退出');
  }
  console.log('当前为调用dll生成数据');
  var v3 = ((new js_call_handdll()).ecghd_gtxt(ddata, usespointer, arrlen));
  console.log(v3);
  usexdtxobj['pdur'] = v3['pDur'];
  usexdtxobj['qrsDur'] = v3['qrsDur'];
  usexdtxobj['tdur'] = v3['tDur'];
  usexdtxobj['prInterval'] = v3['prInterval'];
  usexdtxobj['qt'] = v3['QT'];
  usexdtxobj['qtcB'] = v3['QTc_B'];
  usexdtxobj['qtcF'] = v3['QTc_F'];
  usexdtxobj['paxis'] = v3['P_Axis'];
  usexdtxobj['raxis'] = v3['R_Axis'];
  usexdtxobj['taxis'] = v3['T_Axis'];
  usexdtxobj['baseLineVal'] = v3['baseLineVal'][1];
  usexdtxobj['qamp'] = v3['Q_Amp'][1];
  usexdtxobj['ramp'] = v3['R_Amp'][1];
  usexdtxobj['samp'] = v3['S_Amp'][1];
  usexdtxobj['pamp'] = v3['P_Amp'][1];
  usexdtxobj['tamp'] = v3['T_Amp'][1];
  usexdtxobj['rv5'] = v3['RV5'];
  usexdtxobj['sv1'] = v3['SV1'];
  usexdtxobj['seq'] = ec_index;
  console.log(usexdtxobj);
  $('#xinpai .tr div.td.ri').eq(0).text(v3['pDur']);  //		short pDur;
  $('#xinpai .tr div.td.ri').eq(1).text(v3['qrsDur']); //short qrsDur;													//		short qrsDur;
  $('#xinpai .tr div.td.ri').eq(2).text(v3['tDur']);//		short tDur;
  $('#xinpai .tr div.td.ri').eq(3).text(v3['prInterval']);//		short prInterval;
  $('#xinpai .tr div.td.ri').eq(4).text(v3['QT']);//		short QT;
  $('#xinpai .tr div.td.ri').eq(5).text(v3['QTc_B']);//		short QTc_B;
  $('#xinpai .tr div.td.ri').eq(6).text(v3['QTc_F']);//		short QTc_F;
  $('#xinpai .tr div.td.ri').eq(7).text(v3['P_Axis']);//		short P_Axis;
  $('#xinpai .tr div.td.ri').eq(8).text(v3['R_Axis']);//		short R_Axis;
  $('#xinpai .tr div.td.ri').eq(9).text(v3['T_Axis']);//		short T_Axis;
  $('#xinpai .tr div.td.ri').eq(10).text(v3['baseLineVal'][1]);//short baseLineVal[LEAD_COUNT_ECG];
//	$('#xinpai .tr div.td.ri').eq(10).text(v3['pDur']);
  $('#xinpai .tr div.td.ri').eq(11).text(v3['Q_Amp'][1]);//short Q_Amp[LEAD_COUNT_ECG];
  $('#xinpai .tr div.td.ri').eq(12).text(v3['R_Amp'][1]);//short R_Amp[LEAD_COUNT_ECG];
  $('#xinpai .tr div.td.ri').eq(13).text(v3['S_Amp'][1]);//short S_Amp[LEAD_COUNT_ECG];
  $('#xinpai .tr div.td.ri').eq(14).text(v3['P_Amp'][1]);//short P_Amp[LEAD_COUNT_ECG];
  $('#xinpai .tr div.td.ri').eq(15).text(v3['T_Amp'][1]);//short T_Amp[LEAD_COUNT_ECG];
  $('#xinpai .tr div.td.ri').eq(16).text(v3['RV5']);//short RV5;
  $('#xinpai .tr div.td.ri').eq(17).text(v3['SV1']);//short SV1;
  return;
}

function xp_cledrawline (xp_ctx) {
//	//debugger;
  if (!XPState) {
    return;
  }
  xp_ctx.clearRect(0, 0, xp_ctx.canvas.width, xp_ctx.canvas.height);
  xp_fundgh(xp_ctx, xp_scax, xp_scamm);
};
var ec_stat = 0;
var p1, p2, q1, q2, t1, t2, ec_index;

function ec_funghdgh (p1, p2, q1, q2, t1, t2, ec_index, cet_vh, vrr) {
  GHOBJ = [];
  GHOBJ.length = 0;  //清除鼠标量取对象记录
  XPState = true;   //显示心拍
  wcet_vh = cet_vh;
  $.ajax({
    type: 'POST',
    url: wrcurl + 'api/noAuth/queryWorkRecordParamByEcgId',
    timeout: 30000, contentType: 'application/json;charset=utf-8',
    dataType: 'JSON',
    data: JSON.stringify({
      'ecgId': datastr['id'],
      'seq': ec_index
    }),
    success: function (hres) {
      console.log(hres);
      if (hres['msg'] == 201) {
        //debugger;
        var result = hres.respData;
        var hp1, hp2, hq1, hq2, ht1, ht2;
        if ((result != undefined) && (!!result['location'])) {
          var resuloc = JSON.parse(result['location']);
          hp1 = resuloc['p1'];
          hp2 = resuloc['p2'];
          hq1 = resuloc['q1'];
          hq2 = resuloc['q2'];
          ht1 = resuloc['t1'];
          ht2 = resuloc['t2'];
        } else {
          //debugger;
          var GhtempAr = [p1, p2, q1, q2, t1, t2];   //Ecgp1gh
          var Ghxp_tle = ['P1', 'P2', 'Q1', 'Q2', 'T1', 'T2'];

          function dfgh (titlgh) {  //去除调用dll得到心拍参数p1，p2，q1，q2，t1，t2为零，心拍显示不全的情况
            //		p1,p2,q1,q2,t1,t2
            //		//debugger;
            if (titlgh == 'P1') {
              if (p2 == 0) {
                if (q1 == 0) {
                  p1 = cet_vh - 75;
                } else {
                  p1 = q1 - 60;
                }
              } else {
                p1 = p2 - 30;
              }
              usespointer['p1'] = p1;
            } else if (titlgh == 'P2') {
              if (q1 == 0) {
                p2 = cet_vh - 45;
              } else {
                p2 = q1 - 30;
              }
              usespointer['p2'] = p2;
            } else if (titlgh == 'Q1') {
              q1 = cet_vh - 15;
              usespointer['q1'] = q1;
            } else if (titlgh == 'T2') {
              if (t1 == 0) {
                if (q2 == 0) {
                  t2 = cet_vh + 75;
                } else {
                  t2 = q2 + 60;
                }
              } else {
                t2 = t1 + 30;
              }
              usespointer['t2'] = t2;
            } else if (titlgh == 'T1') {
              if (q2 == 0) {
                t1 = cet_vh + 45;
              } else {
                t1 = q2 + 30;
              }
            } else if (titlgh == 'Q2') {
              q2 = cet_vh + 15;
            }
          }

          for (let d = 0; d < GhtempAr.length; d++) {
            if (GhtempAr[d] == 0) {
              dfgh(Ghxp_tle[d]);
              Ecgp1gh[d] = true;
              continue;
            } else {
              Ecgp1gh[d] = false;
              continue;
            }
          }
          hp1 = p1;
          hp2 = p2,
            hq1 = q1;
          hq2 = q2;
          ht1 = t1;
          ht2 = t2;
        }
        console.log(hp1, hp2, hq1, hq2, ht1, ht2);
        xp_vh = vh;
        xp_p1 = hp1;
        xp_p2 = hp2;
        xp_q1 = hq1;
        xp_q2 = hq2;
        xp_t1 = ht1;
        xp_t2 = ht2;
        usespointer['p1'] = hp1;
        usespointer['p2'] = hp2;
        usespointer['q1'] = hq1;
        usespointer['q2'] = hq2;
        usespointer['t1'] = ht1;
        usespointer['t2'] = ht2;
        ec_index = ec_index;
        xpec_scax = 4;
        xpec_ssta = 0;
        //	    	$(document.getElementById('xinpai')).find('.xp_mosdj').text(ec_index);
        $(document.getElementById('xinpai')).css('display', 'block');
//				console.log(document.getElementById('xpcont').offsetWidth,
//				document.getElementById('xpcont').offsetHeight);
        xp_showGB = true;
        var temwidth = document.getElementById('xpcont').offsetWidth;
        var temheight = document.getElementById('xpcont').offsetHeight;
        $('#xpcontchl').css('width', (temwidth * 0.8) + 'px').css('height', temheight + 'px');
        xp_ctx = document.getElementById('xp_canvas').getContext('2d');
        xp_ctx.canvas.width = temwidth * 0.8;
        xp_ctx.canvas.height = temheight;
        xp_max_width = xp_ctx.canvas.width;
        xp_max_height = xp_ctx.canvas.height;
        xp_max_width = (Math.floor(xp_max_width / (xp_scamm * xp_scax * 5))) * (xp_scamm * xp_scax * 5);
        xp_max_height = (Math.floor(xp_max_height / (xp_scamm * xp_scax * 5))) * (xp_scamm * xp_scax * 5);
        $('#xpcontchl').css('width', xp_max_width + 'px').css('height', xp_max_height + 'px');
        xp_ctx.canvas.width = xp_max_width;
        xp_ctx.canvas.height = xp_max_height;
        xp_cledrawline(xp_ctx);
        //	    	xp_drawmline(xp_ctx,speed,xpec_scax,xp_scamm,dajson, p1,p2,q1,q2,t1,t2,cet_vh,ec_index,linColor,vrr)
        xp_drawmline(xp_ctx, speed, xp_scax, xp_scamm, data[1], xp_p1, xp_p2, xp_q1, xp_q2, xp_t1, xp_t2, cet_vh, ec_index, lincolor, vrr);
        xpec_index = ec_index;
        //			console.log(ec_index); 心拍索引
        resvrr = vrr;
        console.log(usespointer);
        if (result != undefined) {
          console.log('当前显示为后台数据');
          usexdtxobj['pdur'] = result['pdur'];
          usexdtxobj['qrsDur'] = result['qrsDur'];
          usexdtxobj['tdur'] = result['tdur'];
          usexdtxobj['prInterval'] = result['prInterval'];
          usexdtxobj['qt'] = result['qt'];
          usexdtxobj['qtcB'] = result['qtcB'];
          usexdtxobj['qtcF'] = result['qtcF'];
          usexdtxobj['paxis'] = result['paxis'];
          usexdtxobj['raxis'] = result['raxis'];
          usexdtxobj['taxis'] = result['taxis'];
          usexdtxobj['baseLineVal'] = result['baseLineVal'];
          usexdtxobj['qamp'] = result['qamp'];
          usexdtxobj['ramp'] = result['ramp'];
          usexdtxobj['samp'] = result['samp'];
          usexdtxobj['pamp'] = result['pamp'];
          usexdtxobj['tamp'] = result['tamp'];
          usexdtxobj['rv5'] = result['rv5'];
          usexdtxobj['sv1'] = result['sv1'];
          usexdtxobj['seq'] = ec_index;
          console.log(usexdtxobj);
          $('#xinpai .tr div.td.ri').eq(0).text(result['pdur']);  //		short pDur;
          $('#xinpai .tr div.td.ri').eq(1).text(result['qrsDur']); //short qrsDur;													//		short qrsDur;
          $('#xinpai .tr div.td.ri').eq(2).text(result['tdur']);//		short tDur;
          $('#xinpai .tr div.td.ri').eq(3).text(result['prInterval']);//		short prInterval;
          $('#xinpai .tr div.td.ri').eq(4).text(result['qt']);//		short QT;
          $('#xinpai .tr div.td.ri').eq(5).text(result['qtcB']);//		short QTc_B;
          $('#xinpai .tr div.td.ri').eq(6).text(result['qtcF']);//		short QTc_F;
          $('#xinpai .tr div.td.ri').eq(7).text(result['paxis']);//		short P_Axis;
          $('#xinpai .tr div.td.ri').eq(8).text(result['raxis']);//		short R_Axis;
          $('#xinpai .tr div.td.ri').eq(9).text(result['taxis']);//		short T_Axis;
          $('#xinpai .tr div.td.ri').eq(10).text(result['baseLineVal']);//short baseLineVal[LEAD_COUNT_ECG];
          $('#xinpai .tr div.td.ri').eq(11).text(result['qamp']);//short Q_Amp[LEAD_COUNT_ECG];
          $('#xinpai .tr div.td.ri').eq(12).text(result['ramp']);//short R_Amp[LEAD_COUNT_ECG];
          $('#xinpai .tr div.td.ri').eq(13).text(result['samp']);//short S_Amp[LEAD_COUNT_ECG];
          $('#xinpai .tr div.td.ri').eq(14).text(result['pamp']);//short P_Amp[LEAD_COUNT_ECG];
          $('#xinpai .tr div.td.ri').eq(15).text(result['tamp']);//short T_Amp[LEAD_COUNT_ECG];
          $('#xinpai .tr div.td.ri').eq(16).text(result['rv5']);//short RV5;
          $('#xinpai .tr div.td.ri').eq(17).text(result['sv1']);//short SV1;
        } else {
          ecg_getlastst(usespointer, data, resvrr, xpec_index);
        }
      }
    },
    error: function (err) {
      console.log(err);
    }
  });
}

function lingecg_sgbdn (DishInfoArr, speed, ec_stat, resvrr) {
  //	    	//debugger;
  //	    	console.log(DishInfoArr,speed,ec_stat,resvrr);
  //	    	console.log(ec_stat);
  //	    	//debugger;
  //	    	console.log('ecgBeatSet:'+DishInfoArr[sl]['ecgBeatSet']+'/n'+
  //	    				'P_OnSet:'+DishInfoArr[sl]['pWave']['P_OnSet']+'/n'+
  //						'P_OffSet:'+DishInfoArr[sl]['pWave']['P_OffSet']+'/n'+
  //						'Q_OnSet:'+DishInfoArr[sl]['qrsWave']['Q_OnSet']+'/n'+
  //						'Q_OffSet:'+DishInfoArr[sl]['qrsWave']['Q_OffSet']+'/n'+
  //						'T_Set:'+DishInfoArr[sl]['tWave']['T_Set']+'/n'+
  //						'T_OffSet:'+DishInfoArr[sl]['tWave']['T_OffSet'])
//	$(document.getElementById('viewarr')).html('');
  $('#viewarr').children('.verchar').remove();
  if (!jcview) {
    var ec_indgx = 0;
    var verchar_top;
    if (displaystate) {
      verchar_top = (ctx.canvas.height / 7) * 6;
    } else {
      verchar_top = (ctx.canvas.height / 13) * 12;
    }
    var viewidth = ctx.canvas.width;
    for (var sl = 0, sgl = DishInfoArr.length; sl < sgl; sl++) {
      if (DishInfoArr[sl]['ecgBeatSet'] > 0) {
        ec_indgx++;
      }
      if (DishInfoArr[sl]['ecgBeatSet'] > ec_stat) {
        //	    			console.log(scamm,scax,speed/10);
        //	  			console.log(DishInfoArr[sl]['ecgBeatSet']*scamm*scax*speed/250+30+'px');
        if (((DishInfoArr[sl]['ecgBeatSet'] * scamm * scax * speed / 250) - ec_stat + 16) < 0) {
          continue;	//当顶点位置在画布之外是不添加箭头
        }
        ;
        if (((DishInfoArr[sl]['ecgBeatSet'] * scamm * scax * speed / 250) - ec_stat + 16) > viewidth) {
          continue;   //当顶点位置在画布之外是不添加箭头
        }
        ;
        //					console.log('ecgBeatSet:'+DishInfoArr[sl]['ecgBeatSet']+'\n'+
        //	    				'P_OnSet:'+DishInfoArr[sl]['pWave']['P_OnSet']+'\n'+
        //						'P_OffSet:'+DishInfoArr[sl]['pWave']['P_OffSet']+'\n'+
        //						'Q_OnSet:'+DishInfoArr[sl]['qrsWave']['Q_OnSet']+'\n'+
        //						'Q_OffSet:'+DishInfoArr[sl]['qrsWave']['Q_OffSet']+'\n'+
        //						'T_Set:'+DishInfoArr[sl]['tWave']['T_Set']+'\n'+
        //						'T_OffSet:'+DishInfoArr[sl]['tWave']['T_OffSet']);
        //						console.log(DishInfoArr[sl]['ecgBeatSet']);
        $dom = $('<div class="verchar" style="left:' + ((DishInfoArr[sl]['ecgBeatSet'] * scamm * scax * speed / 250) - ec_stat + 16) + 'px;top:' + verchar_top + 'px;"  ' +
          'onclick="ec_funghdgh(' +
          DishInfoArr[sl]['pWave']['P_OnSet'] + ',' +     	 //p1
          DishInfoArr[sl]['pWave']['P_OffSet'] + ',' + 		 //p2
          DishInfoArr[sl]['qrsWave']['Q_OnSet'] + ',' +		 //q1
          DishInfoArr[sl]['qrsWave']['Q_OffSet'] + ',' +		 //q2
          DishInfoArr[sl]['tWave']['T_Set'] + ',' +			 //t1
          DishInfoArr[sl]['tWave']['T_OffSet'] + ',' +		 //t2
          ec_indgx + ',' +
          DishInfoArr[sl]['ecgBeatSet'] + ',' +
          resvrr +
          ')"></div>');
        $(document.getElementById('viewarr')).append($dom);
        //						console.log({
        //							'p1':DishInfoArr[sl]['pWave']['P_OnSet'],
        //							'p2':DishInfoArr[sl]['pWave']['P_OffSet'],
        //							'q1':DishInfoArr[sl]['qrsWave']['Q_OnSet'],
        //							'q2':DishInfoArr[sl]['qrsWave']['Q_OffSet'],
        //							't1':DishInfoArr[sl]['tWave']['T_Set'],
        //							't2':DishInfoArr[sl]['tWave']['T_OffSet'],
        //							'波峰':DishInfoArr[sl]['ecgBeatSet']
        //						});
      }
    }
  }
}

function ecg_test (data) {
  //  			//debugger;
  var ddata = selec_number(data);
  var arrleng = (ddata[0]).length;
  //				console.log(ddata);
  //				console.log(data);
  console.log('数组长度为：' + arrleng);
  if (ddata.length != 13) {
    console.log('请注意,数据长度不为13，可能会导致程序异常退出');
  }
  var resghd_dlldata = (new js_call_lastdll()).ecg_gettext(ddata, arrleng);
  var as_data = resghd_dlldata['res_asdata'];
  var Dishinarr = resghd_dlldata['Disharr'];
  console.log(as_data);
  console.log(Dishinarr);
  Dish_inarr = Dishinarr;
  $('#newtzcscont span#vsbpm').text(as_data[0]);
  $('#newtzcscont span#vfbpm').text(as_data[15]);
  $('#newtzcscont span#vpr').text(as_data[1]);
  $('#newtzcscont span#vp').text(as_data[2]);
  $('#newtzcscont span#vqrs').text(as_data[3]);
  $('#newtzcscont span#vms').text(as_data[4] + '/' + as_data[5]);
  $('#newtzcscont span#vrr').text(as_data[7]);
  $('#newtzcscont span#vrv5sv1').text(as_data[8] / 1000 + '/' + as_data[9] / 1000);
  $('#newtzcscont span#vrv1sv5').text(as_data[11] / 1000 + '/' + as_data[10] / 1000);
  $('#newtzcscont span#vprt').text(as_data[12] + ' ' + as_data[13] + ' ' + as_data[14]);
  $('#miaoshucont').html(as_data[17]);
  $('#textarea').html(as_data[17]);
  resvrr = as_data[7];
  lingecg_sgbdn(Dish_inarr, speed, ec_stat, resvrr);
  // console.log(Dishinarr,speed,ec_stat);
  return;
}


module.exports = {
  js_call_lastdll,
  js_call_handdll,
  selec_number,
  ecg_getlastst,
  xp_cledrawline,
  ec_funghdgh,
  lingecg_sgbdn,
  ecg_test
};
