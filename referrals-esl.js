
/**
 * Created by ethannguyen on 10/05/2016.
 */

define('referrals', ['app', 'ePopup'], function(app, ePopup) {
    const popup = ePopup;
    const referrals = {

        /**
         * SReferrals Initiation Function
         */
        init: () => {
            const self = referrals;
            const referralsButtonLink = document.querySelector('.js-referrals-button-link');
            const referralsShareLink = document.querySelector('.js-referrals-link');
            const socialButtons = document.querySelectorAll('.referralsSocialSharing_socialButton');
            const emailButton = document.querySelector('.referralsSocialSharing_socialButton-email');
            const formButton = document.querySelector('#referralsFormButton');
            const os = self.identifyMobileOS();
        
            self.copyButtonInit(referralsButtonLink, referralsShareLink);
            self.socialButtonExpansion();
            self.sharingEmailButton(self, emailButton);
            self.referralsFormSubmission(self, formButton);
        
            for (let i = 0; i < socialButtons.length; i++) {
                self.addSocialLink(socialButtons[i], referralsShareLink, os);
            }
        },
        
            /**
             *
             * @param self
             * @param emailButton
             */
            sharingEmailButton: (self, emailButton) => {
                if (emailButton) {
                    emailButton.addEventListener('click', () => {
                        const emailsForm = document.querySelector('.js-referrals-email-popup');
                    new popup(emailsForm, 'popupReferralsEmail', true);
                    self.emailSharing(self);
                });
                } else {
                    return false;
                }
            },
        
            /**
             * Email Input Handler Function
             * @param self
             */
            emailSharing: (self) => {
                const emailInputWrapper = document.querySelector(".js-referrals-emails-input");
                emailInputWrapper.focus();
        
                emailInputWrapper.addEventListener('keyup', function(e) {
                    if (e.keyCode === 0 || e.keyCode === 32 || e.keyCode === 188) {
                        const emailInput = document.querySelector(".js-referrals-emails-input");
                        const email = emailInput.value.slice(0, -1);
        
                        self.emailFormHandler(self, email, emailInputWrapper);
                        emailInput.value = "";
                    }
                });
            },
        
            /**
             * injecting email to form function
             * @param self
             * @param email
             * @param emailInputWrapper
             */
            emailFormHandler: (self, email, emailInputWrapper) => {
                const inputContainer = document.querySelector('.js-referrals-valid-emails');
                let emailCount = 0;
        
                if (self.validateEmail(email)) {
                    const emailSpan = `<span id='emailSpan-${emailCount}' class='referralsEmailText'>${email}</span>`;
                    const emailButton = `<span id='emailButton-${emailCount}' class='referralsEmailButton'/>`;
                    const emailInput = `<input id='email-${emailCount}' class='referralsEmail' name='emails' value='${email}' readonly='true' />`;
                    const emailDiv = `<div id='emailDiv-${emailCount}' class='referralsEmailContainer'>${emailSpan} ${emailInput} ${emailButton}</div>`;
        
                    inputContainer.insertAdjacentHTML('beforeend', emailDiv);
        
                    const emailDivNode = inputContainer.lastChild;
                    self.emailDeleteHandler(emailDivNode, emailInputWrapper);
        
                    emailCount++;
                    emailInputWrapper.focus();
                }
            },
        
            /**
             *
             * @param emailCount
             * @param emailInputWrapper
             */
            emailDeleteHandler: (emailDivNode, emailInputWrapper) => {
                const emailButton = emailDivNode.querySelector(`.referralsEmailButton`);
        
                emailButton.addEventListener('click', () => {
                    emailDivNode.remove();
            });
        
                emailInputWrapper.focus();
            },
        
            /**
             * Validating Email Function
             * @param email
             * @returns {boolean}
             */
            validateEmail: (email) => {
                var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
                return re.test(email);
            },
        
            /**
             * Copy Button Initiation Function
             * @param button
             * @param elem
             */
            copyButtonInit: (button, elem) => {
                button.addEventListener('click', () => {
                    elem.select();
        
                try {
                    document.execCommand('copy');
                } catch (err) {
                    console.log('Unable to copy selected text');
                }
            });
            },
        
            /**
             * Social Expansion Function
             */
            socialButtonExpansion: () => {
                const referralsButtonMore = document.querySelector('.js-referrals-button-more');
                const referralsButtonLess = document.querySelector('.js-referrals-button-less');
                const referralsSocialSharing = document.querySelector('.referralsSocialSharing');
        
                referralsButtonMore.addEventListener('click', () => app.element.addClass('expand', referralsSocialSharing));
                referralsButtonLess.addEventListener('click', () => app.element.removeClass('expand', referralsSocialSharing));
            },
        
            /**
             * Social Button Initiation Function
             * @param button
             * @param sharingMessage
             * @param referralsShareLink
             * @param os
             */
            addSocialLink: (button, referralsShareLink, os) => {
                const socialChannel = button.querySelector('span').className.split('-')[1];
                const sharingMessage = button.querySelector('.referralsSharingMessage').innerHTML;
                const encodedMessage = encodeURIComponent(sharingMessage);
                const encodedSite = encodeURIComponent(referralsShareLink.innerHTML.slice(0, -7) + '&');
                const siteRedirectUrl = siteObj.siteNonSecureURL;
                let aHref;
        
                let facebookAppId;
                if (socialChannel === 'facebook' || socialChannel === 'messenger') {
                    facebookAppId = siteObj.social.facebook.appid;
                }
                switch (socialChannel) {
                    case 'facebook':
                        aHref = `https://www.facebook.com/dialog/feed?app_id=${facebookAppId}&display=popup&caption=${encodedMessage}&link=${encodedSite}fbs`;
                        break;
                    case 'messenger':
                        switch (os) {
                            case 'iOS':
                                aHref = `fb-messenger://share?link=${encodedSite}fbm`;
                                break;
                            case 'Android':
                                aHref = `fb-messenger://share?link=${encodedSite}fbm`;
                                break;
                            default:
                                aHref = `https://www.facebook.com/dialog/send?app_id=${facebookAppId}&link=${encodedSite}fbm&redirect_uri=${siteRedirectUrl}`;
                        }
                        break;
                    case 'twitter':
                        aHref = `https://twitter.com/intent/tweet?text=${encodedMessage} ${encodedSite}tw`;
                        break;
                    case 'email':
                        button.onclick = "";
                        return;
                    case 'googlePlus':
                        aHref = `https://plus.google.com/share?url=${encodedSite}gp`;
                        break;
                    case 'weibo':
                        aHref = `http://service.weibo.com/share/share.php?url=${encodedSite}we&appkey=&title=${encodedMessage}&pic=&ralateUid=&language=zh_cn`;
                        break;
                    case 'vk':
                        aHref = `http://vk.com/share.php?url=${encodedSite}vk`;
                        break;
                    case 'whatsapp':
                        aHref = `whatsapp://send?text=${encodedMessage} - ${encodedSite}wa`;
                        break;
                    case 'sms':
                        const encodedBody = encodeURIComponent(`${sharingMessage} - ${referralsShareLink.innerHTML.slice(0, -7)}&sm`);
                        if (os === 'iOS')
                            aHref = `sms:&body=${encodedSite}sm`;
                        else
                            aHref = `sms:?body=${encodedBody}`;
                }
                button.href = aHref;
            },
        
            /**
             *
             * @param self
             * @param formButton
             */
            referralsFormSubmission: (self, formButton) => {
                formButton.addEventListener('click', () => {
                    const emailInput = document.querySelector(".js-referrals-emails-input");
                const email = emailInput.value;
                emailInput.value = "";
        
                if (email) {
                    self.emailFormHandler(self, email);
                }
            });
            },
        
            /**
             * Identify Mobile OS
             * @returns {*}
             */
            identifyMobileOS: () => {
                const userAgent = navigator.userAgent || navigator.vendor || window.opera;
        
                if (userAgent.match(/iPad/i) || userAgent.match(/iPhone/i) || userAgent.match(/iPod/i)) return 'iOS';
                else if (userAgent.match(/Android/i)) return 'Android';
                else return 'unknown';
            }
        };

    referrals.init();
    return referrals;
});
