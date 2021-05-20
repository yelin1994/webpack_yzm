
import 'package:flutter/material.dart';

//  <div class="greybox">
//     Lorem ipsum
// </div>

// .greybox {
//       background-color: #e0e0e0; /* grey 300 */
//       width: 320px;
//       height: 240px;
//       font: 900 24px Georgia;
//       text-align: center;
//     }
  var container = Container(
    child:  Text(
      'Lorem ipsum',
      textAlign: TextAlign.center,
      style: TextStyle(
        fontSize: 24,
        fontWeight: FontWeight.w900,
        fontFamily: 'Georgia'
      ),
    ),
    width: 320,
    height: 240,
    color: Colors.grey[300], // 设置背景颜色 与decoration 重叠,
    // decoration: BoxDecoration(
    //   color: Colors.grey[300]
    // ),
  );

// <div class="greybox">  居中元素
//   Lorem ipsum
// </div>

// .greybox {
//   background-color: #e0e0e0; /* grey 300 */
//   width: 320px;
//   height: 240px;
//   font: 900 24px Roboto;
//   display: flex;
//   align-items: center;
//   justify-content: center; 
// }

var container1 = Container(
  child:  Center(
    child: Text(
      'Lorem ipsum',
     
    ),
  ),
  width: 320,
  height: 240,
  color: Colors.grey[300],
);

// <div class="greybox">
//   <div class="redbox">
//     Lorem ipsum
//   </div>
// </div>

// .greybox {
//   background-color: #e0e0e0; /* grey 300 */
//   width: 320px; 
//   height: 240px;
//   font: 900 24px Roboto;
//   display: flex;
//   align-items: center;
//   justify-content: center;
// }
// .redbox {
//   background-color: #ef5350; /* red 400 */
//   padding: 16px;
//   color: #ffffff;
//   width: 100%;
//   max-width: 240px; 
// }

var container2 = Container(
  child: Center(
    child: Container(
      child: Text(
        'Loren ipsum'
      ),
      decoration: BoxDecoration(
        color: Colors.red[400],
      ),
      padding: EdgeInsets.all(16),
      width: 240,
    ) ,
  ),
  width: 320,
  height: 240,
  color: Colors.grey[300],
);



// <div class="greybox">
//   <div class="redbox">
//     Lorem ipsum
//   </div>
// </div>

// .greybox {
//   background-color: #e0e0e0; /* grey 300 */
//   width: 320px;
//   height: 240px;
//   font: 900 24px Roboto;
//   position: relative; 
// }
// .redbox {
//   background-color: #ef5350; /* red 400 */
//   padding: 16px;
//   color: #ffffff;
//   position: absolute;
//   top: 24px;
//   left: 24px; 
// }


var container3 = Container(
  child: Stack(
    children: [
      Positioned(
        child: Container(
          child: Text(
            'Lorem ipsum',
          ),
          decoration: BoxDecoration(color: Colors.red[400]),
          padding: EdgeInsets.all(16),
        ),
        left: 24,
        top: 24,
      ),
    ],
  ),
  width: 320,
  height: 240,
  color: Colors.grey[300],
);


// <div class="greybox">
//   <div class="redbox">
//     Lorem ipsum
//   </div>
// </div>

// .greybox {
//   background-color: #e0e0e0; /* grey 300 */
//   width: 320px;
//   height: 240px;
//   font: 900 24px Roboto;
//   display: flex;
//   align-items: center;
//   justify-content: center;
// }
// .redbox {
//   background-color: #ef5350; /* red 400 */
//   padding: 16px;
//   color: #ffffff;
//   transform: rotate(15deg); 
// }

var container4 = Container(
  child: Center(
    child: Transform(
      child: Container(
        child: Text('Lorem ipsum', textAlign: TextAlign.center)
      ),
      alignment: Alignment.center,
      transform: 
      // Matrix4.identity() ..rotate(15 * 3.1415927 / 180),
      Matrix4.identity() .. scale(1.5)
    ),
  ),
  width: 320,
  height: 240,
  color: Colors.grey[300],
);

// <div class="greybox">
//   <div class="redbox">
//     Lorem ipsum
//   </div>
// </div>

// .greybox {
//   background-color: #e0e0e0; /* grey 300 */
//   width: 320px;
//   height: 240px;
//   font: 900 24px Roboto;
//   display: flex;
//   align-items: center;
//   justify-content: center;
// }
// .redbox {
//   padding: 16px;
//   color: #ffffff;
//   background: linear-gradient(180deg, #ef5350, rgba(0, 0, 0, 0) 80%); 
// }

var container5 = Container(
  child: Center(
    child: Container(
      child: Text('..',
        style: TextStyle(
          color: Colors.white,
          fontSize: 24,
          fontWeight: FontWeight.w900,
          letterSpacing: 4,
        ),
      ),
      decoration: BoxDecoration(
        // gradient: LinearGradient(
        //   begin: Alignment(0.0, - 1.0),
        //   end: Alignment(0.0, 0.6),
        //   colors: <Color>[
        //     const Color(0xffef5350),
        //     const Color(0x00ef5350)
        //   ]
        // )
        // borderRadius: BorderRadius.all( // border-radius: 8px
        //   const Radius.circular(8)
        // )
        boxShadow: [
          BoxShadow(
            color: const Color(0xcc000000),
            offset: Offset(0, 2),
            blurRadius: 4
          ),
          BoxShadow(
            color: const Color(0x80000000),
            offset: Offset(0, 6),
            blurRadius: 20
          )
        ]

      ),
      padding: EdgeInsets.all(16),
    ),
  ),
  width: 320,
  height: 240,
);


// <div class="greybox">
//   <div class="redbox">
//     Lorem <em>ipsum</em>
//   </div>
// </div>

// .greybox {
//   background-color: #e0e0e0; /* grey 300 */
//   width: 320px;
//   height: 240px;
//   font: 900 24px Roboto;
//   display: flex;
//   align-items: center;
//   justify-content: center;
// }
// .redbox {
//   background-color: #ef5350; /* red 400 */
//   padding: 16px;
//   color: #ffffff;
// }
//  .redbox em {
//   font: 300 48px Roboto;
//   font-style: italic;
// }
// 

var container6 = Container(
  child: Center(
    child: Container(
      child: RichText(
        text: TextSpan(
          children: <TextSpan>[
            TextSpan(text: 'Lorem'),
            TextSpan(
              text: 'ipsum',
              style: TextStyle(
                fontWeight: FontWeight.w300,
                fontStyle: FontStyle.italic,
                fontSize: 48
              )
            )
          ]
        )
      )
    ),
  ),
);



/**
 * overflow: hidden;
 * text-overflow:ellipsis;
 * white-space: nowrap;
 * 
 * overflow: TextOverflow.ellipsis,
 * maxLines: 1
 */

