/**
 * Created by ethannguyen on 20/07/2016.
 */

define(['referrals', 'dom', 'site'], function(referrals, dom, site) {

    describe('referrals', function() {

        beforeEach(function() {
            dom.render();
        });

        afterEach(function() {
            site.resetSiteObject();
        });

        it('should return an object', function() {
            expect(referrals).toEqual(jasmine.any(Object));
        });

        describe('init', function() {
            it('should be a function', function() {
                expect(referrals.init).toEqual(jasmine.any(Function));
            });

            it('should call other functions', function() {
                spyOn(referrals, 'copyButtonInit');
                spyOn(referrals, 'socialButtonExpansion');
                spyOn(referrals, 'sharingEmailButton');
                spyOn(referrals, 'referralsFormSubmission');
                spyOn(referrals, 'addSocialLink');
                referrals.init();
                expect(referrals.copyButtonInit).toHaveBeenCalled();
                expect(referrals.socialButtonExpansion).toHaveBeenCalled();
                expect(referrals.sharingEmailButton).toHaveBeenCalled();
                expect(referrals.referralsFormSubmission).toHaveBeenCalled();
                expect(referrals.addSocialLink).toHaveBeenCalled();
            });
        });

        describe('sharingEmailButton', function() {
            it('should be a function', function() {
                expect(referrals.sharingEmailButton).toEqual(jasmine.any(Function));
            });

            it('should call the emailSharing function', function() {
                var emailButton = document.querySelector('.referralsSocialSharing_socialButton-email');
                spyOn(referrals, 'emailSharing');
                referrals.sharingEmailButton(referrals, emailButton);
                emailButton.click(function() {
                    expect(referrals.emailSharing).toHaveBeenCalled();
                });
            });
        });

        describe('emailSharing', function() {
            it('should be a function', function() {
                expect(referrals.emailSharing).toEqual(jasmine.any(Function));
            });
        });
    });
});
