const models = require('../models');
const Translation = models.Translation;
var oneSky = require('onesky')("a7ywdORyvfs1WAoUEVJ4DJzlnusUvZMv", "u9AGvfquvQx4GRhw7eHZzR9FSO4gHaH1");
const util = require('util')

var strings = require('../public/translation_en.json');

// console.log(strings.length)

// for(let i = 0; i < strings.length; i++){
//                 Translation.upsert(
//                     {lang: 'en', identifier: strings[i].stringKey, phrase: strings[i].string},
//                     strings[i].stringKey)
//                     .then(function(result){
//                         console.log(result.isNewRecord)
//                     })
//
// }


oneSky.project.platforms(305011, function(err, data){

    console.log(err)
    console.log(data)




})

// oneSky.projects(function(err, data){
//
//     if(!err)console.log(data)
//
//
//
// })
// oneSky.project.details("Smartjex (website)", function(err, data){
//
//
//     console.log(data)
//     console.log(err)
// });

// var strings = [{
//     string: 'My webapp is cool',
//     stringKey: 'homepage.webapp_is_cool'
// }, {
//     string: 'Another sentence, without a stringKey'
// }];

// oneSky.string.input(305011, strings, function(err, data){
//
//
//     console.log(data)
//     console.log(err)
// });

oneSky.string.output({
    platformId: 305011
    // locale: 'en_US'
}, function(err, data){
    // console.log(data.translation)
let i = 0;
    for(let lang in data.translation.Default){

        for(let phrase in data.translation.Default[lang]){
            i++;
            Translation.create(
                {lang: lang, identifier: phrase, phrase: data.translation.Default[lang][phrase]},
                phrase)
                .then(function(result){
                    console.log(result.isNewRecord)
                })

        }



    }
            console.log(i)

    // if(data.hasOwnProperty("translation") &&
    //    data.translation.hasOwnProperty("Default") &&
    //    data.translation.Default.hasOwnProperty("en")) {
    //     const object = data.translation.Default.en;
    //     for(let index in object) {
    //
    //         // console.log(object[index])
    //
    //         if (object.hasOwnProperty(index)) {
    //             Translation.upsert(
    //                 {lang: 'en', identifier: index, phrase: object[index]},
    //                 index)
    //                 .then(function(result){
    //                     console.log(result.isNewRecord)
    //                 })
    //         }
    //
    //
    //     }
    // }
});


// Translation.bulkCreate([
//     {lang: 'en', identifier: 'FAQ__QUESTION__1', phrase: 'Ok, I want to exchange some cryptocurrency. Does it mean you will get access to my wallet?'},
//
// ], {});

// console.log()
