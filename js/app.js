"use strict";
/*
    app.js, main Angular application script
    define your module and controllers here
*/
document.getElementById("form-comment").addEventListener("submit", onSubmit);

function onSubmit(evt) {
    console.log("Inside onSubmit!");
    var valid = true;
    try {
        valid = validateForm(this);
    } catch (exception) {
        valid = false;
        console.log(exception);
        alert(exception);
    }

    // stop form submission if validation failed
    if (!valid && evt.preventDefault) {
        evt.preventDefault();
    }

    evt.returnValue = valid;
    return valid;
}

function validateForm(commentForm) {
    var isValid = true;

    var nameField = commentForm.elements["comment-name"];
    var titleField = commentForm.elements["comment-title"];
    var bodyField = commentForm.elements["comment-body"];

    // validates all the required fields
    isValid &= validateString(nameField);
    isValid &= validateString(titleField);
    isValid &= validateString(bodyField);

    return isValid;
}

// validate common string field
function validateString(field) {
    if (0 == field.value.trim().length) {
        field.className = "form-control invalid-field";
        return false;
    } else {
        field.className = "form-control";
        return true;
    }
}


var commentsUrl = 'https://api.parse.com/1/classes/ajaxcomments';
var errorMessage = document.getElementById("comment-message");

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
            if ($scope.newComment.rating == null || $scope.newComment.name == '' || $scope.newComment.title == '' || $scope.newComment.body == '') {

                if ($scope.newComment.rating == null) {
                    errorMessage.style.display = "block";
                    errorMessage.innerHTML = "Please rate 1 to 5.";
                } else {
                    errorMessage.style.display = "none";
                }
                $scope.updating = false;
                return;
            }
            $http.post(commentsUrl, $scope.newComment)
                .success(function (responseData) {
                    $scope.newComment.objectId = responseData.objectId;
                    $scope.comments.push($scope.newComment);
                    $scope.newComment = {
                        rating: null,
                        name: '',
                        title: '',
                        body: ''
                    };
                })
                .error(function (err) {
                    errorMessage.style.display = "block";
                    errorMessage.innerHTML = err.error;
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