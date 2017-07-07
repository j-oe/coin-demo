/** 
	fastclass
	FC/MATRIX MODULE
	(c) 2017 Jan Oevermann
	jan.oevermann@hs-karlsruhe.de
	License: MIT

*/

define(['configs/config-core', 'modules/tokens'], function (cfg, tkns) {

	var mtx = {
		
		/* define configurable weighting functions to calculate values for matrix */
		
		w: {
			/* TF-ICF-CF. Described here: https://www.home.hs-karlsruhe.de/~oeja0001/pub/oevermann-ziegler_doceng_2016-preprint.pdf */
			'tf-icf-cf': function (i, tf_i, C, tf_ij, C_j, D, df_i) {
				return Math.log(1 + tf_i[i]) * Math.log(1 + C.length / tf_i[i]) * (tf_ij / C_j);
			},

			/* TF-IDF-CF. As introduced by Liu/Yang 2012 */
			'tf-idf-cf': function (i, tf_i, C, tf_ij, C_j, D, df_i) {
				return Math.log(1 + tf_i[i]) * Math.log(1 + D / df_i[i]) * (tf_ij / C_j);
			},

			/* TF-IDF (basic) */
			'tf-idf': function (i, tf_i, C, tf_ij, C_j, D, df_i) {
				return tf_i[i] * Math.log(1 + D / df_i[i]);
			},

			/* TF-IDF with smoothing */
			'tf-idf-s': function (i, tf_i, C, tf_ij, C_j, D, df_i) {
				return Math.log(1 + tf_i[i]) * Math.log(1 + D / df_i[i]);
			}

		},


		init: function(memoryObj, inputTextArr) {

			/*
				Initialize matrix

				This function takes a memory object and returns
				a matrix (array of arrays) of this form:

				@avg    | class A | class B | class C | ...
				-------------------------------------------
				Token 1 |  weight |  weight |  weight | ...
				-------------------------------------------
				Token 2 |  weight |  weight |  weight | ...

			*/

			 

			var matrix = [], firstRow = [], allTokenWeights = {};

			// save avg length of objects in upper left corner
			var avgLength = memoryObj['@avg'] || 0;
			firstRow.push(avgLength);

			// get term frequency (tf) of term (i) across all classes & get total number of classes (C)
			var tf_i = {},
				C = [];
				
			for (var c in memoryObj) {
				if (c.slice(0,1) !== '@'){
					C.push(c);
					for (var token in memoryObj[c]) {
						if (!tf_i.hasOwnProperty(token)) tf_i[token] = 0;
						tf_i[token] += memoryObj[c][token];
					}
				}
			}

			// get document frequency (df) of term (i) & get total number of documents (D)
			var df_i = {},
				D = 0;
			
			if (cfg.weightingCalc.indexOf('idf') !== -1) {
				// only do actual calulcation if weighting method is idf-based
				for (var d in inputTextArr) {
					D++;
					var tokensInDoc = tkns.ngram(inputTextArr[d].txt, cfg.nrOfNgrams, cfg.minLengthOfTokens);
					for (var t_i in tf_i) {
						if (tokensInDoc.indexOf(t_i) !== -1){
							df_i[t_i] = df_i[t_i] + 1 || 1;
						}
					}	
				}
			}
			

			// sums of all calculated weights per class (used for normalizing)
			var S = {};

			// calculate all weights w_ij for term (i) in class (j)
			for (var j in memoryObj) {
				// create first row
				if (j.slice(0,1) !== '@') {
					firstRow.push(j);
				}

				// initialize per-class sum
				S[j] = 0;

				// loop through tokens (i) in class (j)
				for (var i in memoryObj[j]) {

					var tf_ij = memoryObj[j][i],
						C_j = memoryObj[j]['@total'];

					// calculate token propability in class
					if (i.slice(0,1) !== '@') {
						
						// use configured weighting method (default: TF-ICF-CF).
						var w_ij = mtx.w[cfg.weightingCalc](i, tf_i, C, tf_ij, C_j, D, df_i);

						S[j] += w_ij;

						var classAndTokenWeight = [j, w_ij];

						// don't store zero weight results as they are automatically added later in prefill step
						if (w_ij > 0) {
							if (!allTokenWeights.hasOwnProperty(i)) allTokenWeights[i] = [];
							allTokenWeights[i].push(classAndTokenWeight);
						}
					}
				}
			}

			// GC
			memoryObj = null;

			// add first row of matrix
			matrix.push(firstRow);
			var firstRowLength = firstRow.length;

			for (var t in allTokenWeights) {
				// create row template with token label (t) and prefill with zeros
				var newRow = [t];

				// caching
				var	tokenWeights = allTokenWeights[t],
					tokenWeightsLength = tokenWeights.length;

				for (var n = 1; n < firstRowLength; n++) newRow.push(0);

				// replace with calculated values (v) where applicable
				for (var v = 0; v < tokenWeightsLength; v++){
					// caching
					var classAndVal = tokenWeights[v],
						valInClass = classAndVal[1],
						classLabel = classAndVal[0];

					// finding position in matrix
					var	position = firstRow.indexOf(classLabel);

					// normalize if configured
					if (cfg.normalizeWeights) {
						valInClass = valInClass / S[classLabel];
					}

					newRow[position] = valInClass;
				}

				// add row to matrix
				matrix.push(newRow);
			}
			return matrix;
		},

		trans: function(matrix) {
			return  matrix[0].map(function (col, i) {
			  return matrix.map(function (row) {
				return row[i];
			  });
			});
		},

		create: function(memoryObj, inputTextArr) {
			return this.trans(this.init(memoryObj, inputTextArr));
		}
	};

	return mtx;

});