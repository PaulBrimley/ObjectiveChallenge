var app = angular.module('objectiveApp', []);

app.controller('mainController', function($scope, mainService) {
    $scope.applicants = {};
    $scope.jobs = {};
    $scope.skills = [];

    mainService.getData().then(function (response) {
        if (response) {
            if (response.jobs && response.jobs.length) {
                response.jobs.map(function (job) {
                    $scope.jobs[job.id] = {
                        name: job.name,
                        applicants: {}
                    }
                });
                if (response.applicants && response.applicants.length) {
                    response.applicants.map(function (applicant) {
                        $scope.jobs[applicant.job_id].applicants[applicant.id] = applicant;
                        $scope.jobs[applicant.job_id].applicants[applicant.id].skills = [];
                        if (response.skills && response.skills.length) {
                            response.skills.map(function (skill) {
                                if (skill.applicant_id === applicant.id) {
                                    $scope.jobs[applicant.job_id].applicants[applicant.id].skills.push(skill);
                                }
                            });
                        }
                    });
                }
            }
        }
        for (var prop in $scope.jobs) {
            var applicantCounter = 0;
            var applicantSkillCounter = 0;
            for (var prop2 in $scope.jobs[prop].applicants) {
                var skillCounter = 0;
                $scope.jobs[prop].applicants[prop2].skills.map(function (skill) {
                    $scope.skills.push({
                        applicantCounter: applicantCounter,
                        skillCounter: skillCounter,
                        applicantId: $scope.jobs[prop].applicants[prop2].id,
                        applicantCoverLetter: $scope.jobs[prop].applicants[prop2].cover_letter,
                        applicantEmail: $scope.jobs[prop].applicants[prop2].email,
                        jobName: $scope.jobs[prop].name,
                        jobId: $scope.jobs[prop].applicants[prop2].job_id,
                        applicantName: $scope.jobs[prop].applicants[prop2].name,
                        applicantWebsite: $scope.jobs[prop].applicants[prop2].website,
                        skill: skill.name
                    });
                    skillCounter++;
                    applicantSkillCounter++;
                });
                applicantCounter++;
            }
            $scope.jobs[prop].applicantSkillCount = applicantSkillCounter;
        }
    });
});

app.service('mainService', function($http, $q) {
    this.getData = function() {
        var dfd = $q.defer();
        $http.get('data/data.json').then(function (response) {
            dfd.resolve(response.data);
        }).catch(function (err) {
            dfd.reject(false)
        });
        return dfd.promise;
    }
});