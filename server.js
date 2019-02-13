var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var app = express();
var path = require('path');

mongoose.connect('mongodb://localhost/pet_shelter_db');

var PetSchema = new mongoose.Schema({
    name: { type: String, required: true, minlength: 3 },
    type: { type: String, required: true, minlength: 3 },
    desc: { type: String, required: true, minlength: 3 },
    skill1: { type: String, required: false },
    skill2: { type: String, required: false },
    skill3: { type: String, required: false },
});

var Pet = mongoose.model('Pet', PetSchema);
var Pet = mongoose.model('Pet');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(express.static(__dirname + '/public/dist/public'));

app.get('/pets', function (req, res) {
    Pet.find({}, function (err, pets) {
        if (err) {
            console.log("Errors!", err);
            res.json({ message: "Error", error: err });
        } else {
            res.json({ message: "Success", pets: pets })
            console.log("Success! Here are the current pets:")
            console.log(pets)
        }
    })
})

app.post('/pets/new', function (req, res) {
    var pet = new Pet({ name: req.body.name, type: req.body.type, desc: req.body.desc, skill1: req.body.skill1, skill2: req.body.skill2, skill3: req.body.skill3 });
    pet.save(function (err) {
        if (err) {
            console.log("Errors!", err);
            res.json({ message: "These are your errors:", error: err });
        } else {
            console.log("Success! You added a pet:");
            res.json({ message: "Success", pet: pet })
        }
    })
})

app.get('/pets/:id', function (req, res) {
    var id = req.params.id;
    Pet.findOne({ _id: id }, function (err, pet) {
        res.json({ pet:pet });
    })
})

app.put('/pets/:id/edit', function (req, res) {
    var id = req.params.id;
    Pet.findById({_id: id}, function (err, pet) {
        if (err) {
            console.log('Errors!');
        } else {
            if (req.body.name) {
                pet.name = req.body.name;
            }
            if (req.body.type) {
                pet.type = req.body.type;
            }
            if (req.body.desc) {
                pet.desc = req.body.desc;
            }
            if (req.body.skill1) {
                pet.skill1 = req.body.skill1;
            }
            if (req.body.skill2) {
                pet.skill2 = req.body.skill2;
            }
            if (req.body.skill3) {
                pet.skill3 = req.body.skill3;
            }
            pet.save(function (err) {
                if (err) {
                    console.log("Errors!", err);
                    res.json({ message: "Error", error: err });
                } else {
                    console.log('Successfully edited a pet!');
                    res.json(pet)
                }
            })
        }
    })
})

app.delete('/pets/:id/delete', function(req, res) {
    var id = req.params.id;
    Pet.remove({_id: id}, function(err) {
      if (err){
        console.log("Returned error", err);
        res.json({message: "Error", error: err});
      } else {
        console.log('Pet adopted!');
        res.json({message: "Success"})
      }
    })
})

app.all("*", (req, res, next) => {
    res.sendFile(path.resolve("./public/dist/public/index.html"))
});

app.listen(8000, function () {
    console.log("Listening on port 8000");
})
