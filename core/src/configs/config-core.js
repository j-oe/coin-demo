/** 
	fastclass
	CORE CONFIGURATION
	(c) 2017 Jan Oevermann
	jan.oevermann@hs-karlsruhe.de
	License: MIT

*/

define({
	/*
		core configuration
	*/
	// how many tokens per group? 1 for stemmend tokens, 2 for bigrams, 3 for trigrams, 0 for combination of all, default: 0
	nrOfNgrams: 0,
	// which method of similarity calculation? 'l1' or 'cosine'
	similarityCalc: 'cosine',
	// which method of weighting calculation? 'tf-icf-cf', 'tf-idf-cf, 'tf-idf-s' or 'tf-idf'
	weightingCalc: 'tf-icf-cf',
	// should normalizing for weighting values be used? boolean, default: true
	normalizeWeights: true,
	// which weight has one standard token group? float, default: 1
	tokenWeighting: 1,
	//are signals enabeld? boolean, default: true
	signalsEnabled: false,
	// which weight has one signal token group? float, default. 2.5
	signalWeighting: 2.5,
	// which minimun number of tokens a module has to have to be included in the memory? integer, default: 0
	minNrOfTokens: 0,
	// which minimun length a token has to have to be included in the memory? integer, default: 0
	minLengthOfTokens: 0
});