#!/usr/bin/env groovy

/*
Required credentials: (username/password -> access_key/secret_key)
'RANCHER_ADS_PUBLIC_PROD'
'RANCHER_DEV'
*/

pipeline {
    agent any
    environment {
        PROJECT = 'country-profile'
        IMAGE_TAG_NAME = "registry-app-p01.ihme.washington.edu/viz/${PROJECT}:${BUILD_NUMBER}"
        USER      = 'svcvizteam'
        REGISTRY  = 'https://registry-app-p01.ihme.washington.edu'
    }
    parameters {
        string(
            name: 'CUSTOM_STACK_NAME',
            description: 'OPTIONAL: override the Rancher stack name (defaults to "country-profile-${AUDIENCE}")',
        )
        choice(
            name: 'RANCHER_ENV',
            choices: ['DEV', 'ADS_PUBLIC_PROD'],
            description: 'Target rancher environment for the deployment.',
        )
        choice(
            name: 'AUDIENCE',
            choices: ['public', 'preview'],
            description: 'Audience for the deployment.',
        )
        choice(
            name: 'BUILD_TYPE',
            choices: ['prod', 'dev'],
            description: "type of npm build for the deployment, affecting bundle size, minification, and source mapping",
        )
        string(
            name: 'SCALE',
            defaultValue: '1',
            description: 'number of containers for the `web` service',
        )
        string(
            name: 'AUTH_BRANCH',
            defaultValue: 'master',
            description: 'branch of `apache-auth` repo',
        )
    }
    stages {
        stage('Build and push image') {
            steps {
                script {
                    docker.withRegistry(env.REGISTRY, env.USER ) {
                        docker.build(
                                "${IMAGE_TAG_NAME}",
                                "--build-arg BUILD_TYPE=${params.BUILD_TYPE} -f Docker/Dockerfile ."
                        ).push()
                    }
                }
            }
        }
        stage('setup deploy environment') {
            steps {
                script {
                    RANCHER_PROJECT_NAME = params.CUSTOM_STACK_NAME ?: "country-profile-${params.AUDIENCE}"
                }
            }
        }
        stage('Deploy') {
            environment {
                AUDIENCE = "${params.AUDIENCE}"
                RANCHER_URL = "${env["RANCHER_URL_${params.RANCHER_ENV}"]}"
                RANCHER_PROJECT_NAME = "${PROJECT}-${params.AUDIENCE}"
                RANCHER_CREDS = credentials("RANCHER_${params.RANCHER_ENV}")
            }
            steps {
                sh """rancher \
                      --url ${RANCHER_URL} \
                      --access-key ${RANCHER_CREDS_USR} \
                      --secret-key ${RANCHER_CREDS_PSW} \
                      up \
                      --stack ${RANCHER_PROJECT_NAME} \
                      --file ${WORKSPACE}/Docker/docker-compose.yml \
                      --rancher-file ${WORKSPACE}/Docker/rancher-compose.yml \
                      -d -u -c -p
                """
            }
        }
    }
}
