/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
var app = {
    // Application Constructor
    initialize: function() {
        document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
    },

    // deviceready Event Handler
    //
    // Bind any cordova events here. Common events are:
    // 'pause', 'resume', etc.
    onDeviceReady: function() {
        this.receivedEvent('deviceready');
    },

    // Update DOM on a Received Event
    receivedEvent: function(id) {
        const vm = new Vue({
            el: '#app',
            data: () => {
                return {
                    loaded: false,
                    email: '',
                    name: ''
                }
            },
            created: () => {
                const token = localStorage.getItem('token')
                if (token) {
                    axios.get('http://10.145.11.118:3000/user', {
                        headers: {
                            'X-Token': token
                        }
                    }).then(resp => {
                        vm.email = resp.data.email
                        vm.name = resp.data.name
                        vm.loaded = true
                    }).catch(resp => {
                        console.error(resp.response.data)
                        alert(resp.response.data.message || 'エラーが発生しました')
                    })
                }
            },
            methods: {
                login: () => {
                    // ログイン
                    return SignInWithApple.request({
                        requestedScopes: [ SignInWithApple.Scope.Email, SignInWithApple.Scope.FullName ]
                    }).then((credential) => {
                        console.info(JSON.stringify(credential, null, 2))
                        return axios.post('http://10.145.11.118:3000/login', {
                            code: credential.authorizationCode
                        }).then(resp => {
                            console.info(resp.data)
                            localStorage.setItem('token', resp.data.token)

                            alert('ログインしました！')
                            vm.email = resp.data.email
                            vm.name = resp.data.name
                        }).catch(resp => {
                            console.error(resp.response.data)
                            alert(resp.response.data.message || 'エラーが発生しました')
                        })
                    }).catch(error => {
                        console.error(error)
                        alert(error.message || 'エラーが発生しました')
                    })
                },
                signup: () => {
                    // 会員登録
                    return SignInWithApple.request({
                        requestedScopes: [ SignInWithApple.Scope.Email, SignInWithApple.Scope.FullName ]
                    }).then((credential) => {
                        console.info(JSON.stringify(credential, null, 2))
                        return axios.post('http://10.145.11.118:3000/signup', {
                            code: credential.authorizationCode,
                            userName: credential.fullName.familyName + ' ' + credential.fullName.givenName
                        }).then(resp => {
                            console.info(resp.data)
                            localStorage.setItem('token', resp.data.token)

                            alert('会員登録しました！')
                            vm.email = resp.data.email
                            vm.name = resp.data.name
                        }).catch(resp => {
                            console.error(resp.response.data)
                            alert(resp.response.data.message || 'エラーが発生しました')
                        })
                    }).catch(error => {
                        console.error(error)
                        alert(error.message || 'エラーが発生しました')
                    })
                },
                logout: () => {
                    localStorage.removeItem('token')
                    vm.name = ''
                    vm.email = ''
                }
            }
        })
    }
};

app.initialize();
