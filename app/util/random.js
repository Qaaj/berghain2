

(function(berghain2) {


    'use strict';

    var Random = function() {




        var constructor = function Random() {

            this.randomList = [];
            this.seed;


            // DOUBLE THE AMOUNT?

            this.randomList.push(1); // .1 %

            for (var i = 0; i < 1000; i++) {

                if (i == 0 || i == 1) { // .2 %
                    this.randomList.push(2);
                } else if (i > 9 && i < 15) { // .5 %
                    this.randomList.push(5);
                } else if (i > 14 && i < 25) { // 1 %
                    this.randomList.push(10);
                } else if (i > 29 && i < 50) { // 2 %
                    this.randomList.push(20);
                } else if (i > 59 && i < 85) { // 2,5 %
                    this.randomList.push(25);
                } else if (i > 99 && i < 150) { // 5 %
                    this.randomList.push(50);
                } else if (i > 199 && i < 300) { // 10 %
                    this.randomList.push(100);
                } else if (i > 399 && i < 600) { // 20 %
                    this.randomList.push(200);
                } else if (i > 599 && i < 850) { // 25 %
                    this.randomList.push(250);
                } else {
                    this.randomList.push(-1);
                }
            };

            this.setSeed = function(seed){
                this.seed = seed;
            }

            this.random = function(){
                return this.seed();
            }

            this.getRandom = function() {
                var result = Math.floor(this.seed() * 1000);
                return this.randomList[result];
            }


        };


        return constructor;

    }();


    berghain2.Random = Random;



})(window.berghain2 = window.berghain2 || {});

