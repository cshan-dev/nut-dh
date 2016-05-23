import { testTest, getAccessToken } from "../src/main.js";
describe("Our main", function(){
	it("is tested", function() {
		expect(true).toBe(true);
	});
});

describe("Take one", function(){
	it("test here", function(){
		expect(testTest()).toEqual(0);
	});
});

describe("Access Token", function(){
	it("try test", function(){
		expect(getAccessToken()).not.toEqual(null);
	});
});
