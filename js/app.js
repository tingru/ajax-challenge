"use strict";
/*
    app.js, main Angular application script
    define your module and controllers here
*/

var commentsUrl = 'https://api.parse.com/1/classes/ajaxcomments';

angular.module('CommentsApp', ['ui.bootstrap'])
    .config(function ($httpProvider) {
        $httpProvider.defaults.headers.common['X-Parse-Application-Id'] = 'zUwjsxWT3bImkGn3KXFUPpguiqoM03ccBgPkKE2I';
        $httpProvider.defaults.headers.common['X-Parse-REST-API-Key'] = 'ilUGyz3DI70IJ01UX1G00jRVdc2hrH97H3iKTeSD';
    })
    .controller('CommentsController', function ($scope, $http) {
        $scope.refreshComments = function () {
            $scope.updating = true;
            $http.get(commentsUrl)
                .success(function (data) {
                    $scope.comments = data.results;
                })
                .finally(function () {
                    $scope.updating = false;
                });
        };
        $scope.refreshComments();

        $scope.newComment = {
            rating: null,
            name: '',
            title: '',            
            body: ''
        };

        $scope.addComment = function () {
            $scope.updating = true;
            $http.post(commentsUrl, $scope.newComment)
                .success(function (responseData) {
                    $scope.newComment.objectId = responseData.objectId;
                    $scope.comments.push($scope.newComment);
                })
                .finally(function () {
                    $scope.updating = false;
                });
        };

        $scope.deleteComment = function (comment) {
            $scope.updating = true;

            $http.delete(commentsUrl + '/' + comment.objectId, comment)
                .success(function () {
                    $scope.refreshComments();
                })
                .finally(function () {
                    $scope.updating = false;
                });
        };
    });