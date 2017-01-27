/* global $http angular $ $scope location localStorage google*/
    var app = angular.module('bar', []);
    
    app.controller('BarController', ['$http', '$scope', '$location',function($http, $scope,$location){
        var bar = this;
        bar.user= sessionStorage.user ? JSON.parse(sessionStorage.user) : {email: "a@a.com", password:"a", password2: "a", logged: false, error: false};
        bar.bars = [];
        bar.text = localStorage.text ? localStorage.text : "";
        $("#text").val(bar.text);
        console.log( $("#text").val());
        bar.bar = {name:"", users: []};
        
        this.searchBars = function () {
            localStorage.text = this.bar.text;
            console.log('this.bar.text',this.bar.text);
            $http.post('/listBars', {text:this.bar.text}).then(function(data){
                bar.bars=  data.data;
                console.log(bar.bars);
            }, function(err) {
                console.log(err);
            });

        };


        this.going = function(bar) {
            console.log('selecionou',bar);
            event.preventDefault();
            $http.post('/goingBar', {name:bar.name, user:this.user.email}).then(function(data){
                bar.users=  data.data;
                console.log('retorno do going',bar.users);
            }, function(err) {
                console.log(err);
            });
        };

        this.cancel = function(bar) {
            event.preventDefault();
            sessionStorage.removeItem('bar');
            location.href='/';
        };


        this.loginUser = function(user) {
            console.log('login',bar.user);
            user = user || bar.user;
            user.error = false;
            user.errorMsg = "";
            $http.post('/loginUser', this.user).then(function(data){
                console.log(bar.user);
                bar.user = data.data;
                if (bar.user.error) return false;
                $("#signInModal").modal('hide');
                // save user
                sessionStorage.user=JSON.stringify(bar.user);
            }, function(err) {
                console.log(err);
            });
        };

      
        this.signOutUser = function() {
            bar.user.logged = false;
            sessionStorage.removeItem('user');
            console.log(bar.user);
            location.href ="/";
            };

        this.addUser = function(user) {
            user = user || bar.user;
            user.error = false;
            user.errorMsg = "";
            if (user.password != user.password2) {
                bar.user.error = true;
                bar.user.errorMsg = "Passwords don't match!!";
                return false;
            }
            $http.post('/addUser', this.user).then(function(data){
                console.log(data.data);
                bar.user = data.data;
                if (bar.user.error) return false;
                $("#signUpModal").modal('hide');
                $("#msg").html("New user added with success!!");
                $("#msgModal").modal('show');
            }, function(err) {
                console.log(err);
            });
        };
    }]);

