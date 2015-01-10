'use strict';

describe('LoginController', function(){
  var scope;

  beforeEach(module('jalagatiJoga'));

  beforeEach(inject(function($rootScope) {
  	scope = $rootScope.$new();
  }));

  it('should have empty credentials', inject(function($controller) {
    expect(scope.credentials).toBeUndefined();

    $controller('LoginController', {
      $scope: scope
  	});

    expect(scope.credentials).toEqual({
      username: '',
      password: ''
    });
  }));

  it('should populate the credentials on login', inject(function($controller) {
    expect(scope.credentials).toBeUndefined();

    $controller('LoginController', {
      $scope: scope,
      $rootScope: null,
      AUTH_EVENTS: null,
      AuthService: null
  	});

    expect(scope.credentials).toEqual({
      username: '',
      password: ''
    });
  }));
  it('has login method', inject(function($controller) {
    expect(scope.login).toBeUndefined();

    $controller('LoginController', {
      $scope: scope,
      $rootScope: null,
      AUTH_EVENTS: null,
      AuthService: null
  	});

    expect(scope.login).toBeDefined();
  }));

  describe('login', function(){
    var authServicePromise, AuthService;
    beforeEach(inject(function($rootScope) {
      scope = $rootScope.$new();
      scope.setCurrentUser = jasmine.createSpy('setCurrentUser');
      scope.$broadcast = jasmine.createSpy('broadcast');
    }));

    it('calls AuthService.login', inject(function($controller){
      authServicePromise = jasmine.createSpy('then');
      AuthService = {login: jasmine.createSpy('login').and.returnValue({
        then: authServicePromise
      })};

      $controller('LoginController', {
        $scope: scope,
        $rootScope: scope,
        AUTH_EVENTS: {loginSuccess:1},
        AuthService: AuthService
      });
      scope.login({username:'my little',password:'secret'});

      expect(AuthService.login).toHaveBeenCalledWith({username:'my little',password:'secret'});
      expect(authServicePromise).toHaveBeenCalled();
    }));

    it('broadcasts on success', inject(function($controller, $q, $rootScope){
      authServicePromise = $q.defer();
      AuthService = {login: jasmine.createSpy('login').and.callFake(function(){
        return authServicePromise.promise;
      })};

      $controller('LoginController', {
        $scope: scope,
        $rootScope: scope,
        AUTH_EVENTS: {loginSuccess:1},
        AuthService: AuthService
      });

      scope.login({username:'my little',password:'secret'});
      authServicePromise.resolve('my little bunny');
      $rootScope.$apply();

      expect(scope.$broadcast).toHaveBeenCalledWith(1);
      expect(scope.setCurrentUser).toHaveBeenCalledWith('my little bunny');
    }));

    it('broadcasts on failure', inject(function($controller, $q, $rootScope){
      authServicePromise = $q.defer();
      AuthService = {login: jasmine.createSpy('login').and.callFake(function(){
        return authServicePromise.promise;
      })};

      $controller('LoginController', {
        $scope: scope,
        $rootScope: scope,
        AUTH_EVENTS: {loginFailed:2},
        AuthService: AuthService
      });

      scope.login({username:'my little',password:'secret'});
      authServicePromise.reject('you crazy fool');

      $rootScope.$apply();
      expect(scope.$broadcast).toHaveBeenCalledWith(2);
    }));

  });
});

describe('Sesssion Service', function(){
  beforeEach(module('jalagatiJoga'));

  it('has necessary properties', inject(function(Session){
    expect(Session.create).toBeDefined();
    expect(Session.destroy).toBeDefined();
  }));
  it('create/destroy populates/clears user data', inject(function(Session){
    Session.create('myId', 'uID', 'uRole');
    expect(Session.id).toEqual('myId');
    expect(Session.userId).toEqual('uID');
    expect(Session.userRole).toEqual('uRole');

    Session.destroy();
    expect(Session.id).toBeNull();
    expect(Session.userId).toBeNull();
    expect(Session.userRole).toBeNull();
  }));
});

describe('AuthService', function(){
  var sessionMock;
  beforeEach(module('jalagatiJoga'));

  beforeEach(function(){
    module(function ($provide) {
      sessionMock = {
        create: jasmine.createSpy('create'),
        destroy: jasmine.createSpy('destroy'),
        id: 'myID',
        userId: 'kilou',
        userRoel: 'ptitlou'
      };
      $provide.value('Session', sessionMock);
    });
  });

  it('creates session at login', inject(function(AuthService, $httpBackend){
    $httpBackend.whenPOST('/login', {'username': 'my little', password: 'secret'})
      .respond({
        id: 'id',
        user: {
          id: 'user',
          role: 'role'
        }
      });
    AuthService.login({'username': 'my little', password: 'secret'});
    $httpBackend.flush();
    expect(sessionMock.create).toHaveBeenCalledWith('id', 'user', 'role');
  }));

  it('can check if authenticated', inject(function(AuthService){
    expect(AuthService.isAuthenticated()).toBeTruthy();

    sessionMock.userId = null;
    expect(AuthService.isAuthenticated()).toBeFalsy();
  }));

  it('authorization is always given (sic!)', inject(function(AuthService){
    expect(AuthService.isAuthorized()).toBeTruthy();

    sessionMock.userId = null;
    expect(AuthService.isAuthorized()).toBeFalsy();

    // allowed if is_public is passed in
    expect(AuthService.isAuthorized(true)).toBeTruthy();
  }));
});
